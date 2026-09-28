import HeroScene from "./HeroScene";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-900 text-white">

      {/* Golden-hour silhouette of a couple (back view, no faces) */}
      <HeroScene />

      {/* Keeps text readable on the left/centre where the scene fades out */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-teal-900/60 via-teal-900/20 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">

        <span className="inline-block bg-white/10 text-amber-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-amber-300/30">
          বিসমিল্লাহির রাহমানির রাহিম
        </span>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-snug mb-4">
          <span className="text-white">১০০% ভেরিফাইড প্রোফাইলে</span>
          <br />
          <span className="text-amber-300">খুঁজুন আপনার জীবনসঙ্গী</span>
        </h1>

        <p className="text-teal-100 text-base md:text-lg max-w-2xl mx-auto mb-8">
          নিরাপত্তা ও গোপনীয়তার সর্বোচ্চ নিশ্চয়তা দিয়ে আমরা দিচ্ছি একটি নিরাপদ, বিশ্বস্ত ম্যাচমেকিং অভিজ্ঞতা।
        </p>

        {/* হাদিস কোট বক্স */}
        <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 max-w-2xl mx-auto mb-8 border border-white/10">
          <p className="text-sm md:text-base text-teal-50 italic">
            যে ব্যক্তি বিবাহ করলো, সে তার দ্বীনের অর্ধেক পূর্ণ করে ফেললো। বাকি অর্ধেকের ব্যাপারে সে আল্লাহকে ভয় করুক।
          </p>
          <p className="text-xs text-amber-300 mt-2">— বায়হাকী, শুআবুল ঈমান, ৫৪৮৬</p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 md:p-6 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <select className="flex-1 rounded-lg p-2.5 text-sm text-gray-900 bg-white">
              <option>আমি খুঁজছি</option>
              <option>পাত্র (Groom)</option>
              <option>পাত্রী (Bride)</option>
            </select>

            <select className="flex-1 rounded-lg p-2.5 text-sm text-gray-900 bg-white">
              <option>বৈবাহিক অবস্থা</option>
              <option>অবিবাহিত</option>
              <option>বিবাহবিচ্ছেদ</option>
              <option>বিধবা/বিপত্নীক</option>
            </select>

            <button className="bg-amber-400 hover:bg-amber-300 text-teal-950 font-semibold px-6 py-2.5 rounded-lg text-sm transition whitespace-nowrap">
              সার্চ করুন
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
