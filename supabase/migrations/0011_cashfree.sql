-- Cashfree as an online payment method alongside Razorpay.
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check check (payment_method in ('cod', 'razorpay', 'cashfree'));

-- Release stock held by any unpaid online order (Razorpay or Cashfree) after 45 minutes.
create or replace function public.release_stale_orders() returns int
language plpgsql security definer set search_path = public as $$
declare o record; i order_items%rowtype; nb int; n int := 0;
begin
  for o in select * from orders where payment_method <> 'cod' and payment_status in ('pending','failed')
      and status = 'placed' and created_at < now() - interval '45 minutes' for update skip locked loop
    for i in select * from order_items where order_id = o.id loop
      update variants set stock = stock + i.qty where id = i.variant_id returning stock into nb;
      insert into stock_movements(variant_id, change, balance, reason, reference, note)
        values (i.variant_id, i.qty, nb, 'cancel', o.order_no, 'Payment not completed');
    end loop;
    update orders set status = 'cancelled', updated_at = now() where id = o.id;
    n := n + 1;
  end loop;
  return n;
end $$;
