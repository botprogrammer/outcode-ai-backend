export const TAG_CATEGORIES = [
  {
    id: "languages",
    label: "Languages",
    tags: [
      "Javascript",
      "Typescript",
      "Python",
      "Java",
      "Go",
      "C",
      "C++",
      "Rust",
      "Ruby",
    ],
  },
  {
    id: "frameworks-tools",
    label: "Frameworks & Tools",
    tags: [
      "React",
      "Node",
      "HTML/CSS",
      "Laravel",
      "Springboot",
      "Django",
      "Flask",
      "SQL",
      "DSA",
      "Git",
    ],
  },
];

export const TAG_CATALOG = TAG_CATEGORIES.flatMap((category) => category.tags);
