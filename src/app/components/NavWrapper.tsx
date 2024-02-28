import { getCurrentUser } from "../lib/session";
import Nav from "./Nav";

const NavWrapper = async () => {
  const session = await getCurrentUser();

  return <Nav session={session} />;
};

export default NavWrapper;
