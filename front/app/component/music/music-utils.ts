import { Lyric, TrackMeta } from "@/app/lib/type";

type LyricsSearchResult = {
  artistName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
  trackName: string;
};

export type LyricsPayload = {
  lyrics: Lyric[];
  plainLyrics: string;
  mode: "none" | "plain" | "synced";
};

const TITLE_NOISE_PATTERN =
  /\((official|audio|video|mv|m\/v|visualizer|lyrics?|lyric video|performance|teaser|cover|live|sped up|slowed(?:\s*\+\s*reverb)?)[^)]*\)|\[(official|audio|video|mv|m\/v|visualizer|lyrics?|lyric video|performance|teaser|cover|live|sped up|slowed(?:\s*\+\s*reverb)?)[^\]]*\]/gi;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeArtist(author: string) {
  return normalizeWhitespace(author.replace(/\s+-\s+Topic$/i, ""));
}

function normalizeTitle(title: string) {
  return normalizeWhitespace(title.replace(TITLE_NOISE_PATTERN, ""));
}

function normalizeForCompare(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTrackSignature(track: TrackMeta) {
  const cleanedAuthor = normalizeArtist(track.author);
  const cleanedTitle = normalizeTitle(track.title);
  const splitTitle = cleanedTitle.split(/\s[-–—]\s/);

  if (splitTitle.length >= 2) {
    return {
      artist: normalizeWhitespace(splitTitle[0]),
      title: normalizeWhitespace(splitTitle.slice(1).join(" - ")),
      fallbackArtist: cleanedAuthor,
      fallbackTitle: cleanedTitle,
    };
  }

  return {
    artist: cleanedAuthor,
    title: cleanedTitle,
    fallbackArtist: cleanedAuthor,
    fallbackTitle: cleanedTitle,
  };
}

function scoreLyricsCandidate(
  candidate: LyricsSearchResult,
  track: TrackMeta,
  duration: number
) {
  const signature = parseTrackSignature(track);
  const candidateTitle = normalizeForCompare(candidate.trackName);
  const candidateArtist = normalizeForCompare(candidate.artistName);
  const targetTitle = normalizeForCompare(signature.title);
  const fallbackTitle = normalizeForCompare(signature.fallbackTitle);
  const targetArtist = normalizeForCompare(signature.artist);
  const fallbackArtist = normalizeForCompare(signature.fallbackArtist);

  let score = 0;

  if (candidateTitle === targetTitle) score += 8;
  else if (candidateTitle === fallbackTitle) score += 6;
  else if (candidateTitle.includes(targetTitle) || targetTitle.includes(candidateTitle)) score += 4;

  if (candidateArtist === targetArtist) score += 6;
  else if (candidateArtist === fallbackArtist) score += 4;
  else if (
    candidateArtist.includes(targetArtist) ||
    targetArtist.includes(candidateArtist) ||
    candidateArtist.includes(fallbackArtist)
  ) {
    score += 2;
  }

  if (duration > 0 && candidate.duration > 0) {
    const diff = Math.abs(candidate.duration - duration);
    if (diff <= 2) score += 4;
    else if (diff <= 5) score += 3;
    else if (diff <= 10) score += 1;
  }

  if (candidate.syncedLyrics) score += 2;
  if (candidate.plainLyrics) score += 1;
  if (candidate.instrumental) score -= 3;

  return score;
}

export function parseSyncedLyrics(rawLyrics: string): Lyric[] {
  const lines = rawLyrics.split(/\r?\n/);
  const parsed: Lyric[] = [];

  for (const line of lines) {
    const matches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g)];
    const text = normalizeWhitespace(line.replace(/\[[^\]]+\]/g, ""));

    if (!matches.length || !text) continue;

    for (const match of matches) {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const fraction = match[3] ? Number(`0.${match[3].padEnd(3, "0")}`) : 0;

      parsed.push({
        time: minutes * 60 + seconds + fraction,
        lyric: {
          or: text,
          tr: "",
        },
      });
    }
  }

  return parsed.sort((a, b) => a.time - b.time);
}

export async function fetchLyricsForTrack(
  track: TrackMeta,
  duration: number
): Promise<LyricsPayload> {
  const signature = parseTrackSignature(track);
  const params = new URLSearchParams();

  params.set("track_name", signature.title || signature.fallbackTitle);
  if (signature.artist) {
    params.set("artist_name", signature.artist);
  }

  const response = await fetch(`https://lrclib.net/api/search?${params.toString()}`);
  if (!response.ok) {
    return { lyrics: [], plainLyrics: "", mode: "none" };
  }

  const results = (await response.json()) as LyricsSearchResult[];
  if (!Array.isArray(results) || results.length === 0) {
    return { lyrics: [], plainLyrics: "", mode: "none" };
  }

  const bestMatch = [...results]
    .sort((left, right) => {
      return scoreLyricsCandidate(right, track, duration) - scoreLyricsCandidate(left, track, duration);
    })[0];

  if (!bestMatch || bestMatch.instrumental) {
    return { lyrics: [], plainLyrics: "", mode: "none" };
  }

  if (bestMatch.syncedLyrics) {
    const lyrics = parseSyncedLyrics(bestMatch.syncedLyrics);
    if (lyrics.length > 0) {
      return {
        lyrics,
        plainLyrics: bestMatch.plainLyrics ?? "",
        mode: "synced",
      };
    }
  }

  if (bestMatch.plainLyrics) {
    return {
      lyrics: [],
      plainLyrics: bestMatch.plainLyrics,
      mode: "plain",
    };
  }

  return { lyrics: [], plainLyrics: "", mode: "none" };
}
