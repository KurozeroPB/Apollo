export default `{
    repositoryOwner(login: "kurozeropb") {
        ... on ProfileOwner {
            itemShowcase {
                items(first: 6) {
                    totalCount
                    edges {
                        node {
                            ... on Repository {
                                name
                                createdAt
                                updatedAt
                                url
                                description
                                forkCount
                                homepageUrl
                                stargazers {
                                    totalCount
                                }
                                fundingLinks {
                                    platform
                                    url
                                }
                                issuesOpen: issues(states: OPEN) {
                                    totalCount
                                }
                                issuesClosed: issues(states: CLOSED) {
                                    totalCount
                                }
                                primaryLanguage {
                                    name
                                    color
                                }
                                topics: repositoryTopics(first: 10) {
                                    nodes {
                                        topic {
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;
