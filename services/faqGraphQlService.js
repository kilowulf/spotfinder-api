const { ApolloServer, gql } = require("apollo-server-express");
const { InMemoryLRUCache } = require("apollo-server-caching");

// GraphQL schema
const typeDefs = gql`
  type Query {
    faq: [FAQ]
  }

  type FAQ {
    id: ID!
    question: String!
    answer: [String!]!
    details: String!
    category: String!
  }
`;

// Sample FAQ data
const faqs = [
  {
    id: "1",
    question: "What is open source?",
    answer: [
      "Open source is software where the original source code is made freely available for modification or redistribution."
    ],
    details: "details1",
    category: "Open Source"
  },

  {
    id: "2",
    question: "What does this website do?",
    answer: [
      "Spotfinder is a web source for information on helping developers find new and exciting projects to contribute to within the open source environment, specifically on Github"
    ],
    details: " ",
    category: "SpotFinder as a Resource"
  },

  {
    id: "3",
    question: "How to contribute to open source?",
    answer: [
      "Each Open Source project will have different criteria on how to choose who will be eligible for contribution. Most Open Source projects actively looking for contributors will post a contributors guidelines to aid prospective developers in applying."
    ],
    details: " ",
    category: "Becoming a Open Source Contributor"
  },
  {
    id: "4",
    question: "What are contributor guidelines?",
    answer: [
      "These guidelines set the base criteria for those applying to a project as a contributor."
    ],
    details: " ",
    category: "Becoming a Open Source Contributor"
  },
  {
    id: "5",
    question: "What are Issue Labels?",
    answer: [
      "There are numerous labels used in a project as a short hand note to inform actively working or potential contributors to the project what an issue may involve within any given scope of the project"
    ],
    details: "",
    category: "Open Source on Github"
  },
  {
    id: "6",
    question: "What is a repository on GitHub?",
    answer: [
      "A repository on GitHub is a storage space where your project lives. It can contain folders and any type of files (HTML, CSS, JavaScript, Documents, Data, Images), and is often used for organizing a single project."
    ],
    details:
      "Repositories can be public or private and can include a README file to describe the project.",
    category: "Open Source on Github"
  },
  {
    id: "7",
    question: "How do I fork a repository?",
    answer: [
      "Forking a repository means creating a copy of someone else's project to your GitHub account. This allows you to freely experiment with changes without affecting the original project."
    ],
    details:
      "Most open-source contributions start with forking a repository. You can then clone your fork, make changes, and submit a pull request.",
    category: "Open Source on Github"
  },
  {
    id: "8",
    question: "What is a pull request?",
    answer: [
      "A pull request is a method of submitting contributions to an open-source project. It's a request to the project owner to pull your changes into their repository."
    ],
    details:
      "Pull requests show diffs, or differences, of the content from both branches. The changes are shown in green and red.",
    category: "Open Source on Github"
  },
  {
    id: "9",
    question: "How do I clone a repository?",
    answer: [
      "Cloning a repository means creating a local copy of a project that exists remotely. You can clone a repository from GitHub to your local machine using Git commands."
    ],
    details:
      "This is often the first step in contributing to a project, as it allows you to work on the code locally.",
    category: "Open Source on Github"
  },
  {
    id: "10",
    question: "What is an Issue in GitHub?",
    answer: [
      "Issues are a great way to keep track of tasks, enhancements, and bugs for your projects. They act as a discussion forum for collaborating on projects."
    ],
    details:
      "When you find a bug or have an idea for an enhancement, opening an issue is the way to start the conversation.",
    category: "Becoming a Open Source Contributor"
  },
  {
    id: "11",
    question: "How can I find beginner-friendly open-source projects?",
    answer: [
      "Look for projects with tags like 'good first issue' or 'beginner-friendly'. GitHub's Explore page and websites like 'Up For Grabs' can also help you find such projects."
    ],
    details:
      "Starting with small, beginner-friendly projects can be a great way to get familiar with the process of contributing to open source.",
    category: "Becoming a Open Source Contributor"
  },
  {
    id: "12",
    question: "What are GitHub Actions?",
    answer: [
      "GitHub Actions help you automate tasks within your software development life cycle. They can be used to build, test, and deploy your code."
    ],
    details:
      "GitHub Actions are event-driven, meaning they can be triggered after certain events in your repository, like a push or a pull request.",
    category: "Github"
  },
  {
    id: "13",
    question: "What should I look for in a healthy open-source project?",
    answer: [
      "A healthy open-source project typically has active development, a clear README, good documentation, responsive maintainers, and a welcoming community."
    ],
    details:
      "Check the frequency of commits, open vs. closed issues ratio, and recent pull requests to gauge the activity level.",
    category: "Github"
  },
  {
    id: "14",
    question: "How important is documentation in open-source projects?",
    answer: [
      "Documentation is crucial in open-source projects. It helps users and contributors understand how to use and contribute to the project effectively."
    ],
    details:
      "Good documentation often includes setup instructions, usage guides, and contribution guidelines.",
    category: "Open Source"
  },
  {
    id: "15",
    question: "What is a 'README' file in a GitHub repository?",
    answer: [
      "A README file provides information about the project, such as what it does, how to set it up, and how to contribute. It's often the first thing users see in a repository."
    ],
    details:
      "A well-written README is crucial for attracting contributors and users.",
    category: "Project Documentation"
  },
  {
    id: "16",
    question:
      "How can I evaluate the long-term viability of an open-source project?",
    answer: [
      "Look at the project's history of contributions, release frequency, community engagement, and whether it's backed by organizations or notable individuals."
    ],
    details:
      "A project with regular updates and a supportive community is more likely to be sustainable.",
    category: "SpotFinder as a Resource"
  },
  {
    id: "17",
    question: "What are the best practices for submitting a pull request?",
    answer: [
      "Ensure your code follows the project's style guidelines, write meaningful commit messages, provide a clear description in your pull request, and where possible, add tests."
    ],
    details:
      "It's also good practice to discuss significant changes in an issue before submitting a pull request.",
    category: "Becoming a Open Source Contributor"
  },
  {
    id: "18",
    question: "How can I effectively maintain my own open-source project?",
    answer: [
      "Be responsive to issues and pull requests, keep your documentation up to date, and be clear about your project's goals and contribution guidelines."
    ],
    details:
      "Building a community around your project can also help with maintenance and development.",
    category: "Project Documentation"
  },
  {
    id: "19",
    question: "What is the significance of licensing in open-source projects?",
    answer: [
      "Licenses determine how others can use, modify, and distribute your project. Choosing the right license is crucial for the legal protection of your project and its contributors."
    ],
    details:
      "Popular licenses include MIT, GPL, and Apache. Each has different requirements and protections.",
    category: "Project Documentation"
  },
  {
    id: "20",
    question: "How can I stay updated with the latest trends in open-source?",
    answer: [
      "Follow open-source news portals, join relevant communities and forums, attend meetups and conferences, and contribute to or start your own projects."
    ],
    details:
      "Platforms like GitHub, GitLab, and Bitbucket also provide insights into trending projects.",
    category: "SpotFinder as a Resource"
  }

  // Add more FAQs here
];

// Resolvers
const resolvers = {
  Query: {
    faq: () => faqs
  }
};

// Create and export Apollo Server instance
const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: {
    cache: new InMemoryLRUCache({
      maxSize: 1000000, // Adjust the size according to your needs
      ttl: 3600000 // Time to live in milliseconds
    })
  }
});
module.exports = graphqlServer;
