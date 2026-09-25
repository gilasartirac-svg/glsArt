export default function PermissionGuard(permission,user){

return user?.permissions?.includes(permission);

}
