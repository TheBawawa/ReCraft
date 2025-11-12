import React, { useEffect, useState } from "react";

async function fetchProfile() {
  await new Promise((r) => setTimeout(r, 400));
  return {
    id: "u_123",
    name: "Demo User",
    email: "demo@example.com",
    avatarUrl: "",
    postsCount: 12,
    likesCount: 340,
    followersCount: 98,
    subscribed: false,
  };
}

async function fetchGallery() {
  await new Promise((r) => setTimeout(r, 300));
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `g_${i}`,
    imageUrl: `https://picsum.photos/seed/${i + 3}/600/400`,
    title: `Post #${i + 1}`,
  }));
}

export default function ProfileUI({ onSubscribeToggle }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [p, g] = await Promise.all([fetchProfile(), fetchGallery()]);
      if (!mounted) return;
      setProfile(p);
      setSubscribed(!!p.subscribed);
      setGallery(g);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleSubscribe = async () => {
    const next = !subscribed;
    setSubscribed(next);
    try {
      await onSubscribeToggle?.(next);
    } catch (err) {
      setSubscribed(!next);
      alert("Subscribe action failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center py-10 px-4 bg-white">
      <div className="w-full max-w-6xl rounded-2xl p-6 md:p-10 bg-white border border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr] gap-6 items-start">

          {/* Profile pic */}
          <div className="flex items-center gap-4">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold overflow-hidden">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>pfp</span>
              )}
            </div>
          </div>

          {/* Subscribe */}
          <div className="flex md:justify-start">
            <button
              onClick={handleToggleSubscribe}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-black text-white font-medium shadow active:translate-y-[2px]"
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Stats */}
          <div className="relative">
            <div className="absolute -right-2 -bottom-2 h-full w-full rounded-3xl bg-black/60" />
            <div className="relative bg-white rounded-3xl px-6 py-5 border border-black/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <Stat label="Posts" value={loading ? "—" : profile?.postsCount ?? 0} />
                <Stat label="Likes" value={loading ? "—" : profile?.likesCount ?? 0} />
                <Stat label="Followers" value={loading ? "—" : profile?.followersCount ?? 0} />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-10 relative">
          <div className="absolute -right-3 -bottom-3 h-full w-full rounded-[2rem] bg-black/60" />
          <div className="relative bg-white rounded-[2rem] p-6 md:p-8 border border-black/10">
            <h2 className="text-2xl font-semibold mb-5">Gallery</h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.slice(0, 9).map((item) => (
                  <figure key={item.id} className="rounded-3xl overflow-hidden aspect-[4/3]">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg md:text-xl font-medium">{label}</span>
      <span className="text-sm md:text-base text-black/70">{value}</span>
    </div>
  );
}
