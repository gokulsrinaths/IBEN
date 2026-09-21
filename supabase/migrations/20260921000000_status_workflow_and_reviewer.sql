-- Replace the placeholder status lifecycle with the real applicant
-- review workflow, and record who reviewed a submission and when.

alter table public.submissions
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamptz;

-- Drop the old constraint before remapping values -- otherwise the
-- UPDATEs below fail against the still-active old check.
alter table public.submissions drop constraint if exists submissions_status_check;

update public.submissions set status = 'submitted' where status = 'received';
update public.submissions set status = 'under_review' where status = 'in_review';
update public.submissions set status = 'selected' where status = 'accepted';
update public.submissions set status = 'not_selected' where status in ('declined', 'withdrawn');

alter table public.submissions
  add constraint submissions_status_check
  check (status in (
    'submitted',
    'under_review',
    'more_info_required',
    'shortlisted',
    'selected',
    'not_selected'
  ));
alter table public.submissions alter column status set default 'submitted';
