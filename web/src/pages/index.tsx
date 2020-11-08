import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Box, Button, Flex, Stack, Link, Heading, Text } from "@chakra-ui/core";
import NextLink from "next/link"
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({limit: 4, cursor: null as null | string});
  const [{data, fetching}] = usePostsQuery({ 
    variables
  });

  if(!fetching && !data){
    return <div> Failed to fatch data </div>
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading> Reddit-Clone </Heading>
        <NextLink href="/create-post">
        <Link ml="auto">
          <Button mt={4} variantColor="teal"> create post </Button>
        </Link>
      </NextLink>
      </Flex>
      <br />
      <Box mt={10}> Posts </Box>
      <br />
      {!data && fetching? (
        <div> Loading... </div> ):( 
          <Stack spacing={8}>
          { data!.posts.posts.map((p) => (
            <Box p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box> 
            )) 
          }
          </Stack>
          ) 
      }
      {data && data.posts.hasMore? (
        <Flex>
        <Button onClick={() => {
          setVariables({
            limit: variables.limit,
            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
          })
        }}isLoading={fetching} m="auto" my={8}> 
          Load More 
        </Button>
      </Flex> ): null}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
