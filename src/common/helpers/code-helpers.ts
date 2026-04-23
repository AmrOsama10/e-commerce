export const generateCode = async () => {
    const { nanoid } = await import('nanoid')
    return nanoid(6)
}