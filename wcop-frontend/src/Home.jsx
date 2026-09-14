import HomeNavbar from "./components/home/HomeNavbar";
import IntroductionSection from "./components/home/IntroductionSection";
import PlatformOverview from "./components/home/PlatformOverview";
import ComplaintWorkflow from "./components/home/ComplaintWorkflow";
import HomeFooter from "./components/home/HomeFooter";

function Home() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <HomeNavbar />

            <main>
                <IntroductionSection />
                <PlatformOverview />
                <ComplaintWorkflow />
            </main>

            <HomeFooter />
        </div>
    );
}

export default Home;