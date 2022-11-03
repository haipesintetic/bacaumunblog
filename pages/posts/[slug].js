import { GraphQLClient, gql } from "graphql-request";
import styles from "../../styles/Slug.module.css";

const graphcms= new GraphQLClient(
    "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cla0pikzo46d801tb7claff3z/master"
  );

const QUERY = gql`
  query PostMUN($slug: String!) {
    postMUN(where:{slug:$slug}){
        title,
        slug,
        category,
      coverPhoto{
        url
      },
        content{
          html
        },
        author{
          name,
          avatar{
            url
          }
        },
      }
  }
`;
const SLUGLIST = gql`
  {
    postsMUN {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { postsMUN} = await graphcms.request(SLUGLIST);
  return {
    paths: postsMUN.map((postMUN) => ({ params: { slug: postMUN.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({params}) {
    const slug=params.slug;
    const data=await graphcms.request(QUERY,{slug});
    const postMUN=data.postMUN;
    return {
      props:{
        postMUN
      },
      revalidate : 10,
    };
  }

export default function BlogPost({ postMUN }) {
  return (
    <main className={styles.blog}>
      <img
        className={styles.cover}
        src={postMUN.coverPhoto.url}
        alt={postMUN.title}
      />
      <div className={styles.title}>
        <div className={styles.authdetails}>
          <img src={postMUN.author.avatar.url} alt={postMUN.author.name} />
          <div className={styles.authtext}>
            <h6>By {postMUN.author.name} </h6>
            <h6 className={styles.date}>
              {postMUN.category}
            </h6>
          </div>
        </div>
        <h2>{postMUN.title}</h2>
        <div className={styles.content} 
        dangerouslySetInnerHTML={{__html:postMUN.content.html}}>
        </div>
      </div>

    </main>
  );
}
