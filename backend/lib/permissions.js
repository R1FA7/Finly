export const PERMISSIONS ={
  'transaction.view':'View income/expense',
  'transaction.create':'Create income/expense',
  'transaction.edit':'Edit income/expense',
  'transaction.delete':'Delete income/expense',

  'dashboard.view':'View dashboard',
  'goal.manage':'CRUD goal',

  'adminDashboard.view':'View admin dashboard & do operations'
}

export const ROLE_PERMISSIONS = {
  'user':[
    'transaction.view',
    'transaction.create',
    'transaction.edit',
    'transaction.delete',
    'transaction.download',
    'dashboard.view',
    'goal.manage',
  ],
  'admin':[
    'adminDashboard.view',
    'transaction.view','dashboard.view',
  ]
}
export function getPermissionsForRole(role){
  return ROLE_PERMISSIONS[role] || []
}