import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;

  return (
    <main className={styles.contentContainer}>
      {results.map(post => (
        <article key={post.uid} className={styles.postContainer}>
          <h2>{post.data.title}</h2>
          <p>{post.data.subtitle}</p>
          <section>
            <time>{post.first_publication_date}</time>
            <span>{post.data.author}</span>
          </section>
        </article>
      ))}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts');

  console.log(JSON.stringify(postsResponse, null, 2));

  const { next_page } = postsResponse;

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page,
        results: posts,
      },
    },
  };
};
