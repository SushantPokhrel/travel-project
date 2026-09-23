import { MapPin, Search } from "lucide-react";
import Button from "@/components/Button";

export default function Landing() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)]">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/32225798/pexels-photo-32225798.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="landing-img"
          className="w-full h-full object-cover"
        />
        <div className="overlay absolute inset-0 bg-primary/45"></div>
      </div>
      <div className="wrapper relative px-5 lg:px-8 py-18 text-center max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] text-white">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">
          Explore Nepal with a
          <span className="block text-secondary">Local Guide</span>
        </h1>
        <div>
          <p className="mt-5 sm:text-lg drop-shadow">
            From Everest base camps to the tea gardens of Ilam — book trusted,
            verified local guides who know every trail, temple, and story.
          </p>

          {/* Search Input & Tags Container */}
          <div className="mt-8 w-full max-w-xl mx-auto flex flex-col items-center gap-4">
            {/* White Rounded Input Box */}
            <div className="w-full bg-body-bg text-text-para rounded-2xl sm:rounded-full p-2 flex items-center shadow-lg shadow-black/5">
              <div className="pl-3 pr-2 text-emerald-800">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <input
                type="text"
                placeholder="Where in Nepal? Try Dharan, Ilam, Pokhara..."
                className="w-full bg-transparent md:px-2 placeholder:tracking-tight placeholder:text-text-muted placeholder:text-xs md:placeholder:text-sm focus:outline-none text-sm sm:text-base"
              />
              <Button
                type="button"
                className="cursor-pointer bg-primary text-white p-3 rounded-xl  transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5" /> <span className="font-medium hidden md:inline-block">Find guides</span>
              </Button>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-200">
              <span className="font-medium mr-1">Popular:</span>
              <button className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm transition-colors">
                Kathmandu
              </button>
              <button className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm transition-colors">
                Dharan
              </button>
              <button className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm transition-colors">
                Ilam
              </button>
              <button className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm transition-colors">
                Pokhara
              </button>
              <button className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm transition-colors">
                Chitwan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}