import { cc } from "@/utils";
import Image from "next/image";

const Spinner = ({ wrapper = false }) => {
  return (
    <div className={cc("place_in_center", wrapper && "mt-72 md:mt-80")}>
      <Image
        priority={true}
        src="/icons/loader.svg"
        width={50}
        height={50}
        alt="loader"
        className="object-contain"
      />
    </div>
  );
};

export default Spinner;
