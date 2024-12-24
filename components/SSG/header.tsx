import logo from "@/assets/logo.png";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header id="main-header">
      <Link href="/">
        <Image
          width={100}
          height={100}
          // sizes="(max-width: 60dvw) 10dvw, (max-width: 120dvw) 20dvw, 30dvw"
          src={logo}
          alt="Mobile phone with posts feed on it"
          placeholder={"empty"}
          priority
        />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          <li>
            <Link className="cta-link" href="/new-post">
              New Post
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
