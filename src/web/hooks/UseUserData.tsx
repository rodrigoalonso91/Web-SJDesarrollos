import { useUser } from "@auth0/nextjs-auth0"
import { UserRole } from "@web/constants/UserRole";

export default function useUserData() {
	const { user } = useUser()
	const roles = (user?.[ROLES_PROPERTY_NAME] as ReadonlyArray<string>) || []

	const isAdmin = roles.includes(UserRole.Admin)
	const isAuditor = roles.includes(UserRole.Auditor)
	const isProprietor = roles.includes(UserRole.Proprietor)
	const isSalesman = roles.includes(UserRole.Salesman)

	return { 
		isAdmin, 
		isAuditor, 
		isProprietor,
		isSalesman,
		isLoggedIn: true, 
		email: user?.email, 
		nickname: user?.nickname,
		roles
	}
}

export const ROLES_PROPERTY_NAME = `${process.env.NEXT_PUBLIC_WEB_DOMAIN}/roles`

