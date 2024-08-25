const { gql } = require("@apollo/client");
const client = require("./githubService");

// query to find public repos: open source
const SEARCH_QUERY = gql`
  query SearchRepositories(
    $searchTerm: String!
    $after: String
    $issueLabels: [String!]!
  ) {
    search(query: $searchTerm, type: REPOSITORY, first: 20, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Repository {
            id
            name
            url
            createdAt
            contributingGuidelines {
              body
            }
            mentionableUsers {
              totalCount
            }
            description
            isArchived
            stargazers {
              totalCount
            }
            owner {
              id
              login
              url
              __typename
            }
            assignableUsers {
              totalCount
            }
            licenseInfo {
              key
            }
            primaryLanguage {
              name
            }
            languages(first: 5) {
              edges {
                node {
                  name
                }
              }
            }
            issues(labels: $issueLabels, states: OPEN, first: 10) {
              totalCount
              edges {
                node {
                  id
                  body
                  createdAt
                }
              }
            }
            pullRequests(last: 1, states: MERGED) {
              edges {
                node {
                  mergedAt
                }
              }
            }
          }
        }
      }
    }
  }
`;

// helper function to format date
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// normailzation
const normalizeQueryResultData = searchResults => {
  return searchResults.map(edge => {
    const repo = edge.node;

    return {
      id: repo.id,
      name: repo.name,
      url: repo.url,
      createdAt: formatDate(repo.createdAt),
      contributingGuidelinesBody: repo.contributingGuidelines
        ? repo.contributingGuidelines.body
        : null,
      mentionableUsersCount: repo.mentionableUsers
        ? repo.mentionableUsers.totalCount
        : 0,
      description: repo.description,
      isArchived: repo.isArchived,
      starCount: repo.stargazers ? repo.stargazers.totalCount : 0,
      owner: {
        id: repo.owner.id,
        login: repo.owner.login,
        url: repo.owner.url
      },
      assignableUsersCount: repo.assignableUsers
        ? repo.assignableUsers.totalCount
        : 0,
      licenseKey: repo.licenseInfo ? repo.licenseInfo.key : null,
      primaryLanguage: repo.primaryLanguage ? repo.primaryLanguage.name : null,
      languages: repo.languages
        ? repo.languages.edges.map(edge => edge.node.name)
        : [],
      issueCount: repo.issues ? repo.issues.totalCount : 0,
      issues: repo.issues ? repo.issues.edges.map(edge => edge.node) : [],
      latestMergedPR:
        repo.pullRequests && repo.pullRequests.edges.length > 0
          ? formatDate(repo.pullRequests.edges[0].node.mergedAt)
          : null
    };
  });
};

const searchGithub = async ({ searchTerm, issueLabels, after }) => {
  try {
    const result = await client.query({
      query: SEARCH_QUERY,
      variables: {
        searchTerm,
        issueLabels,
        after
      },
      fetchPolicy: "cache-first"
    });

    const data = result.data;
    console.log(data);
    const endCursor = data.search.pageInfo.endCursor;

    const normalizedData = normalizeQueryResultData(data.search.edges);

    return {
      data: normalizedData,
      endCursor
    };
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    throw error;
  }
};

module.exports = { searchGithub };
