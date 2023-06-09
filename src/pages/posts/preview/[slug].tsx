import { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { getPrismicClient } from "../../../services/prismic"
import { RichText } from "prismic-dom"
import Head from "next/head"

import styles from '../post.module.scss'
import Link from "next/link"
import { useRouter } from "next/router"
import type { Content } from '@prismicio/client'

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updated: string;
    }
}


export default function PostPreview({ post }: PostProps) {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post?.slug}`)
        }
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updated}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            Subscribe now 🤗
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient()

    // const response = await prismic.getByUID<Content.PostDocument>('post', String(slug), {})

    const response = await prismic.getByUID<
        Content.PostDocument & {
            data: {
                title,
                content
            }

        }
    >('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response?.data?.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updated: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })

    }

    return {
        props: {
            post
        },
        redirect: 60 * 30 //30 minutes
    }
}