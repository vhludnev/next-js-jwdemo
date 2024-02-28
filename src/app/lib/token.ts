import jwt from "jsonwebtoken";

type ForgotPsswordTokenProps = {
  userId: string;
};

type SignUpTokenProps = {
  name: string;
  email: string;
  password: string;
};

type TokenProps = ForgotPsswordTokenProps | SignUpTokenProps;

interface JwtPayload {
  userId: string;
}

export const createToken = (data: TokenProps, expiresIn = "1h") => {
  return jwt.sign(data, process.env.RESET_TOKEN_SECRET!, {
    expiresIn,
  });
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = await jwt.verify(token, process.env.RESET_TOKEN_SECRET!);

    if (decoded) {
      const { userId } = decoded as JwtPayload;
      return userId;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const verifyEmailToken = async (token: string) => {
  try {
    const data = await jwt.verify(token, process.env.RESET_TOKEN_SECRET!);

    if (data) {
      const { name, email, password } = data as SignUpTokenProps;
      return { name, email, password };
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
