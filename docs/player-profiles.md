# Player profiles

The Tyrrells Open player profiles are integrated into the existing About Us
page. The six established member cards are accessible selectors for an
expanded profile beneath the grid. A stable `player` query parameter opens one
of the six existing leaderboard identities, for example:

```text
about.html?player=sam-dynes
```

`src/data/player-data.js` is the normalized source for public profile content.
It contains only fields and background wording extracted from the six supplied
Player Profile DOCX documents. Unknown, blank, and `XXX` source values are
stored as `null`; the renderer displays those values as a restrained `TBC`.
The original DOCX files are external source material and are not copied into
the repository. Approved player photographs live under
`public/images/players/`, keyed by the same stable player identities.

`src/player-profiles.js` renders the selected profile using DOM text nodes,
keeps only one profile open, and updates selection history without a
client-side router. Initially no profile is open unless a valid deep link is
present. Each player record contains the public path for its card photograph;
the expanded profile deliberately does not repeat that image.

Leaderboard member-name links are added by `src/main.js` from the stable ID and
display-name mapping and target the corresponding About Us deep link. This
integration changes links only; leaderboard data, results, scoring, and
calculations remain unchanged.
