import { SignInButton } from "@clerk/nextjs";
import EastIcon from "@mui/icons-material/East";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 md:px-12 text-center bg-gradient-to-b from-background via-sidebar/10 to-background">
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Detect AI Content in Seconds
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-3xl mx-auto">
            Upload image, video, or audio (.mp3, .wav) files to instantly detect
            whether they are AI generated or human made.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton>
              <button className="px-8 py-4 rounded-xl text-lg font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 hover:cursor-pointer transition-all duration-300 glow-animate flex items-center gap-2">
                Start Free Detection
                <EastIcon className="w-5 h-5" />
              </button>
            </SignInButton>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-12 bg-sidebar/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Drop your file.",
              },
              {
                step: "2",
                title: "Analyze",
                desc: "AI scans content in <60 seconds.",
              },
              {
                step: "3",
                title: "Result",
                desc: "Clear decision + confidence score.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-primary/30 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
