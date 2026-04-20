import Link from "next/link";
import { ChevronLeft, Atom } from "lucide-react";

const chapters = [
  {
    id: "f-ma",
    title: "1-1. 뉴턴의 제2법칙 (F=ma)",
    description: "가속도의 법칙: 힘과 질량, 가속도의 관계를 실험합니다.",
    path: "/physics/f-ma"
  },
  {
    id: "action-reaction",
    title: "1-2. 뉴턴의 제3법칙 (작용-반작용)",
    description: "작용-반작용의 법칙: 두 물체 사이에 작용하는 힘의 관계를 실험합니다.",
    path: "/physics/action-reaction"
  }
];

export default function PhysicsHub() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            <span>메인 화면으로</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              <Atom size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">물리학 (Physics)</h1>
              <p className="text-slate-400 mt-1">뉴턴 역학부터 현대 물리까지의 실험실</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {chapters.map((chapter) => (
            <Link 
              key={chapter.id} 
              href={chapter.path}
              className="group p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                    {chapter.title}
                  </h2>
                  <p className="text-slate-400 mt-2">{chapter.description}</p>
                </div>
                <div className="text-slate-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all">
                  <ChevronLeft size={24} className="rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
