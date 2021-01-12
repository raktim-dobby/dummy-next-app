import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

interface Launches{
  id: Number,
  links: any,
  video_link:String,
  rocket:any,
  rocket_name:any,
  launch_date_local: Date,
  launch_site: any,
  site_name_long:String
  mission_name: String
}

interface PageProps{
  launches: Launches[]
}

export default function Home({launches} : PageProps) {
  console.log("launches", launches)
  return (
    <div className={styles.container}>
      <Head>
        <title>Space X Launches</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SpaceX Launches
        </h1>

        <p className={styles.description}>
         Latest Launches from SapceX
        </p>

        <div className={styles.grid}>

          {launches.map((launch,i) => {
            return(
              <div className={styles.card}>
              <a key={i} href={launch.links.video_link}>
              <h3>{launch.mission_name}</h3> </a>
              <p><strong>Rocket Name: </strong>{launch.rocket.rocket_name}</p>
              <p><strong>Launch Time: </strong>{new Date(launch.launch_date_local).toLocaleDateString('en-US')}</p>
              <p><strong>Launch Site: </strong>{launch.launch_site.site_name_long}</p>
              {/* <Link href={`/details/?mission_name=${launch.mission_name}`}><button>View Details</button></Link> */}
              <Link href={`/details/[mission_name]/?mission_name=${launch.mission_name}`}><button>View Details</button></Link>
          </div>
            )
          })}

         
        </div>
      </main>

    </div>
  )
}


// export async function getStaticProps(){
//   const client = new ApolloClient({
//     uri:'https://api.spacex.land/graphql',
//     cache: new InMemoryCache
//   })

//   const {data} = await client.query({
//     query: gql`
//       query GetLaunches {
//         launchesPast(limit: 10){
//           id
//           mission_name
//           launch_date_local
//           launch_site{
//             site_name_long
//           }
//           links{
//             article_link
//             video_link
//             mission_patch
//           }
//           rocket {
//             rocket_name
//           }
//         }
//       }
//     `
//   })

export async function getServerSideProps(){
  const client = new ApolloClient({
    uri:'https://api.spacex.land/graphql',
    cache: new InMemoryCache,
  })


  const {data} = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10){
          id
          mission_name
          launch_date_local
          launch_site{
            site_name_long
          }
          links{
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  })

  console.log('data', data)
  return{
    props:{
      launches: data.launchesPast
    }
  }
} 