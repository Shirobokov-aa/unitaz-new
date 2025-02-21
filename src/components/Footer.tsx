import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
        <div className="w-full border-t border-black py-12">
          <div className="flex lg:flex-row flex-col justify-between">
            <div className="logo">
              <Link href="/" className="lg:block hidden text-2xl font-bold">
                <Image src="/img/logo.svg" alt="Logo" width={263} height={35} className="object-contain" />
              </Link>
              <Link href="/" className="block lg:hidden text-2xl font-bold">
                <Image src="/img/logo.svg" alt="Logo" width={168} height={22} className="object-contain" />
              </Link>
            </div>
            <div className="lg:pt-0 pt-4">
              <nav>
                <ul>
                  <li>
                    <Link href={"/"}>Ванная</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Кухня</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Коллекции</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Сервисы</Link>
                  </li>
                  <li>
                    <Link href={"/"}>О компании</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="max-w-[230px] lg:py-0 py-10">Санкт-Петербург, Пулковское шоссе 40, корпус 4</div>
            <div>
              <Link href={"mailto:info@abelsberg.com"}>info@abelsberg.com</Link>
            </div>
          </div>
        </div>
        <div className="lg:hidden block w-full border-t border-black pt-5 pb-7"></div>
      </div>
    </footer>
  );
}
