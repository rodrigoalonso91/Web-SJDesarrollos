import "../styles/globals.css"
import { UserProvider } from "@auth0/nextjs-auth0"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { store } from "../src/web/store/store"
import { Navbar } from "./../src/web/components"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<Provider store={store}>
				<Navbar />
				<Component {...pageProps} />
			</Provider>
		</UserProvider>
	)
}
