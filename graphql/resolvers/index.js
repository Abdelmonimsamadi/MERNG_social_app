import userResolver from "./userResolver";
import postResolver from "./postResolver";

export default {
    Query: {
        ...userResolver.Query,
        ...postResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postResolver.Mutation
    }
}