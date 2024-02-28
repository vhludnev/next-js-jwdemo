type Props = {
  message?: {
    status: string;
    text: string;
  };
};

const Notification = ({ message }: Props) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={`text-center ${message?.status}`}>{message?.text}</div>
  );
};

export default Notification;
