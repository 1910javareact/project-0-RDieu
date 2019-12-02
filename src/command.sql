

select * from ers_reimbursement;


select reimb_type from ers_reimbursement_type;


select reimb_status from ers_reimbursement_status;


select 
  reimb_id, reimb_amount, reimb_submitted,
  reimb_resolved, reimb_description,
	reimb_author, reimb_resolver, reimb_status_id, reimb_type_id
from ers_reimbursement;


select r.reimb_id,  r.reimb_author, r.reimb_submitted, 
    t.reimb_type, r.reimb_amount, r.reimb_description,
    r.reimb_resolver, s.reimb_status, r.reimb_resolved
from ers_reimbursement r
  inner join ers_reimbursement_status s
  on   s.reimb_status_id =r.reimb_status_id 
    inner join ers_reimbursement_type t
    on t.reimb_type_id = r.reimb_type_id
where reimb_status = 'Approved';


select reimb.reimb_id
from ers_reimbursement reimb
  inner join ers_users
  on ers_users.ers_users_id = reimb.reimb_author;



select REIMB_AMOUNT, REIMB_SUBMITTED, REIMB_RESOLVED,
REIMB_DESCRIPTION, REIMB_AUTHOR, REIMB_RESOLVER, REIMB_STATUS_ID, REIMB_TYPE_ID
from ers_reimbursement
where reimb_id=2;

select * from ers_users;


SELECT USER_FIRST_NAME, USER_LAST_NAME
FROM ERS_USERS
WHERE ERS_USERS_ID =1;


SELECT u.ers_users_id, u.user_first_name, u.user_last_name,
  u.user_email, r.ers_user_role_id, r.user_role
FROM ers_users u
		INNER JOIN ers_user_roles r
		ON r.ers_user_role_id = u.user_role_id
WHERE ers_username = 'roody'
AND ers_password = 'passwordc';



select * from ers_reimbursement where reimb_author=2;

SELECT REIMB_ID, REIMB_AMOUNT,
s.REIMB_STATUS_ID, s.REIMB_STATUS, 
t.REIMB_TYPE_ID, t.REIMB_TYPE,
REIMB_DESCRIPTION, REIMB_SUBMITTED, REIMB_RESOLVED,
u.ERS_USERS_ID AS AUTHOR_ID, 
u.ERS_USERNAME AS AUTHOR_USERNAME, 
u.USER_FIRST_NAME AS AUTHOR_FIRST_NAME, 
u.USER_LAST_NAME AS AUTHOR_LAST_NAME, 
u.USER_EMAIL AS AUTHOR_EMAIL
FROM ERS_REIMBURSEMENT r
 JOIN ERS_REIMBURSEMENT_TYPE t
  ON r.REIMB_TYPE_ID = t.REIMB_TYPE_ID
    JOIN ERS_REIMBURSEMENT_STATUS s
    ON r.REIMB_STATUS_ID = s.REIMB_STATUS_ID
      Left JOIN ERS_USERS u
      ON r.REIMB_AUTHOR = u.ERS_USERS_ID
WHERE r.REIMB_AUTHOR = 1;
   


select * from ers_reimbursement;


SELECT REIMB_ID, REIMB_AMOUNT,
s.REIMB_STATUS_ID, s.REIMB_STATUS, 
t.REIMB_TYPE_ID, t.REIMB_TYPE,
REIMB_DESCRIPTION, REIMB_SUBMITTED, REIMB_RESOLVED,
auth.ERS_USERS_ID AS AUTHOR_ID, 
auth.ERS_USERNAME AS AUTHOR_USERNAME, 
auth.USER_FIRST_NAME AS AUTHOR_FIRST_NAME, 
auth.USER_LAST_NAME AS AUTHOR_LAST_NAME, 
auth.USER_EMAIL AS AUTHOR_EMAIL,
  res.ERS_USERS_ID AS RESOLVER_ID, 
  res.ERS_USERNAME AS RESOLVER_USERNAME, 
  res.USER_FIRST_NAME AS RESOLVER_FIRST_NAME, 
  res.USER_LAST_NAME AS RESOLVER_LAST_NAME, 
  res.USER_EMAIL AS RESOLVER_EMAIL
FROM ERS_REIMBURSEMENT r
  JOIN ERS_REIMBURSEMENT_TYPE t
  ON r.REIMB_TYPE_ID = t.REIMB_TYPE_ID
    JOIN ERS_REIMBURSEMENT_STATUS s
    ON r.REIMB_STATUS_ID = s.REIMB_STATUS_ID
      Left JOIN ERS_USERS auth
 ON r.REIMB_AUTHOR = auth.ERS_USERS_ID
        Left join ers_users res
        on r.reimb_resolver = res.ERS_USERS_ID;

