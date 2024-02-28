import { useEffect, useState } from "react";
import { BsChevronUp } from "@/lib/icons";

const BackToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleShow = () => {
      if (window.scrollY > 1000) {
        return setShow(true);
      }
      return setShow(false);
    };

    window.addEventListener("scroll", handleShow);

    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  const scrollUp = () => {
    return window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed rounded border border-gray-300 bg-gray-100 p-1 right-7 bottom-5 md:right-10 md:bottom-10 transition-all ease-in-out duration-700 ${
        show ? "visible opacity-70 cursor-pointer" : "invisible opacity-0"
      }`}
    >
      <BsChevronUp onClick={scrollUp} size={20} color="#333333" />
    </div>
  );
};

export default BackToTopButton;
