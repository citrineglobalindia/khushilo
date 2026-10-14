-- Khushilo sells spices: default HSN 0910 (spice mixtures/turmeric) at 5% GST.
-- Per-product codes are set on each product (0904 chilli, 0909 coriander/cumin) and editable in Admin → Products.
alter table products alter column hsn set default '0910', alter column gst_rate set default 5;
create or replace function public.order_items_tax() returns trigger language plpgsql security definer set search_path = public as $$
begin
  select coalesce(p.hsn, '0910'), coalesce(p.gst_rate, 5) into new.hsn, new.gst_rate
    from variants v join products p on p.id = v.product_id where v.id = new.variant_id;
  new.hsn := coalesce(new.hsn, '0910'); new.gst_rate := coalesce(new.gst_rate, 5);
  return new;
end $$;
revoke execute on function public.order_items_tax() from public, anon, authenticated;
