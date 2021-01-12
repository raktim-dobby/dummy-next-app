import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import {useRouter} from 'next/router'


export default function Details({launch}) {
  const {mission_name} = useRouter().query
    const launchData = launch[0]
  return (
    <div className={styles.container}>
      <Head>
        <title>Space X Launches</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/"><a>Go Back Home</a></Link>
        <h1>{mission_name}</h1>
        <div style={{paddingLeft:'12rem', paddingRight:'12rem'}}>
        <p >{launchData!=undefined ? launchData.details : 'Details: N/A'}</p>
        <p>{ launchData!=undefined ? launchData.site_long_name : 'Site: N/A'}</p>
        </div>
       
        
      </main>

    </div>
  )
}


export async function getServerSideProps({query}){

  const mission_name = query.mission_name
  console.log('inside query: ',query.mission_name)
  const client = new ApolloClient({
    uri:'https://api.spacex.land/graphql',
    cache: new InMemoryCache,
    query: query.mission_name
  })

  const {data} = await client.query({
    query: gql`
      query GetLaunchesPast {
        launchesPast(find: {mission_name: "${mission_name}"}) {
            details
            launch_year
            launch_success
            mission_name
            rocket {
              rocket_name
              rocket_type
            }
            links {
              article_link
              video_link
              flickr_images
            }
          }
        }
    `
  })


    return{
      props:{
      launch: data.launchesPast
    }
  }
  
} 