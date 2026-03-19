import Image from "next/image"

export const Logo = () => {
    return (
        <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={120}
            priority // It tells Next.js to load it immediately
            style={{ height: "auto" }}
        />
    )
}