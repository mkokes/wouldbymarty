export const INSTAGRAM_HANDLE = 'wouldbymarty';
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export const SITE_TAGLINE = "If they don't find you handsome, they should at least find you handy";

export interface WorkshopTool {
  id: string;
  name: string;
  category: string;
  status: string;
  summary: string;
  features: string[];
  url: string;
  repoUrl?: string;
}

export const TOOLS_EYEBROW = 'Shop utilities';
export const TOOLS_HEADING = 'Tools';
export const TOOLS_INTRO =
  "Woodworking apps and utilities I'm building for the bench and lathe—made to run right in your browser, even offline in the shop.";

export const WORKSHOP_TOOLS: WorkshopTool[] = [
  {
    id: 'segmentor',
    name: 'Segmentor',
    category: 'Woodturning studio',
    status: 'Web App · PWA',
    summary:
      'Design closed-segment, open-segment, and stave woodturned bowls and vases from any profile—with live 3D previews, wall-safety checks, kerf-accurate cut sheets, and 1:1 printable shop templates.',
    features: ['Closed & open rings', 'Stave vessels', 'Live 3D preview', 'Kerf-accurate cut sheets'],
    url: 'https://segmentor.wouldbymarty.com/',
    repoUrl: 'https://github.com/mkokes/segmentor',
  },
];

export const ABOUT_HEADING = 'About the maker';
export const ABOUT_PARAGRAPHS = [
  'Hi, I’m Marty. I have an affliction which you might describe as diarrhea of the hobbies. Right now that hobby is woodworking, I wanted to make my own ukulele, I did that and it turns out there are other things you can make out of wood too, so I kept going.',
  'Some builds are for the people closest to me, like a side table for my wife with legs cut from 2x4s and an elm top with a jatoba and aspen stripe. Some are rescues, like an antique oak table and a sewing table, brought back to life. And some are just to see if I can, like a water bottle glued up from wedges of aspen, maple, mahogany and walnut.',
  'Everything here is made by hand, one piece at a time. Follow along on Instagram to see what’s on the workbench next.',
];
