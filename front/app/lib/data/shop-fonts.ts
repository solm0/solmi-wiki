import { Weight } from "lucide-react";

export type FontAxis = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type ShopFont = {
  id: string;
  name: string;
  fileName: string;
  detailHref: string;
  sampleText: string;
  defaultSize: number;
  size: {
    min: number;
    max: number;
    step: number;
  };
  axes: FontAxis[];
};

export const shopFonts: ShopFont[] = [
  {
    id: "labrouste",
    name: "Labrouste",
    fileName: "Labrouste.ttf",
    detailHref: "/cmdbfxchq000imdampt826hpv",
    sampleText: "도스토옙스키 정신이란 자칫하면 낭비일 것 같소. 위고를 불란서의 빵 한 조각이라고는 누가 그랬는지 지언인 듯싶소. 그러나 인생 혹은 그 모형에 있어서 '디테일' 때문에 속는다거나 해서야 되겠소?",
    defaultSize: 130,
    size: {
      min: 50,
      max: 210,
      step: 1,
    },
    axes: [
    ],
  },
  {
    id: "Ж",
    name: "Ж VF",
    fileName: "Zhe.ttf",
    detailHref: "/cmdbggydg000umdam4pl46dnp",
    sampleText: "ЖИТЬ БЫТЬ",
    defaultSize: 175,
    size: {
      min: 100,
      max: 250,
      step: 1,
    },
    axes: [
      {
        key: "wght",
        label: "weight",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: "comixtura-code",
    name: "Comixtura Code",
    fileName: "ComixturaCode.otf",
    detailHref: "/cmdbgon5b0010mdamfnqyzmv9",
    sampleText: "The Quick Brown Fox Jumps Over The Lazy Designer",
    defaultSize: 60,
    size: {
      min: 20,
      max: 100,
      step: 1,
    },
    axes: [
    ],
  },
  {
    id: "dr-phong",
    name: "Dr.Phong VF",
    fileName: "DrPhong.ttf",
    detailHref: "/cmdbgrn950013mdamemjflr33",
    sampleText: "We do not expect to be able to display the object exactly as it would appear in reality, with texture, overcast shadows, etc. We hope only to display an image that approximates the real object closely enough to provide a certain degree of realism.",
    defaultSize: 120,
    size: {
      min: 60,
      max: 180,
      step: 1,
    },
    axes: [
      {
        key: "ANGL",
        label: "angle",
        min: 1,
        max: 180,
        step: 1,
        defaultValue: 90,
      },
      {
        key: "AREA",
        label: "area",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 50,
      },
    ],
  },
  {
    id: "slovo",
    name: "Slovo VF",
    fileName: "Slovo.ttf",
    detailHref: "/cmlusn6za001xfq1i5b3xkz3i",
    sampleText: "В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!",
    defaultSize: 120,
    size: {
      min: 50,
      max: 190,
      step: 1,
    },
    axes: [
      {
        key: "ROMN",
        label: "romn",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
      },
    ],
  },
];
