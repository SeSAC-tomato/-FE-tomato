export default function Post({ params }: { params: { id: string } }) {
  const { id } = params
  return <>{id}</>
}
