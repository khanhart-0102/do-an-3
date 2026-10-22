import { Footer } from "./footer";
import { Header } from "./header";

type Props = {
    children: React.ReactNode;
}

const MarketingLayout = ({children}:Props)=>{
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header/>
            <main className="flex-1">
                {children}
            </main>
            <Footer/>
        </div>
    )
}

export default MarketingLayout;