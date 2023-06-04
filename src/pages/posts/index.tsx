import Head from 'next/head'
import styles from './styles.module.scss'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'
import Link from 'next/link'
import type { Content } from '@prismicio/client'

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updateAt: string
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {

    return (
        <>
            <Head>
                <title>
                    Posts | Ignews
                </title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {
                        posts.map(post => (
                            <Link key={post.slug} href={`/posts/${post.slug}`}>
                                <time>{post?.updateAt}</time>
                                <strong>{post?.title}</strong>
                                <p>{post?.excerpt}</p>
                            </Link>

                        ))
                    }

                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const prismic = getPrismicClient()

    const response = await prismic.getAllByType<
        Content.PostDocument & {
            data: {
                title,
                content
            }

        }
    >('post', {
        fetch: ['post.title', 'post.content'],
        pageSize: 100
    })

    const posts = response.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post?.data?.title),
            excerpt: post?.data?.content.find(content => content?.type === 'paragraph')?.text ?? '',
            updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: { posts }
    }
}