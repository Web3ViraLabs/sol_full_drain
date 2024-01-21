import Main from "./main";

// ? This is basically the gradient div container

const Content = () => {
  return (
    <div
      className="p-1 rounded-3xl w-full max-w-[--content-w]"
      style={{
        background:
          "linear-gradient(247deg, rgba(199, 242, 132, 1) 13.88%, rgba(0, 190, 240, 1) 99.28%), #0F161C",
      }}
    >
      <div
        className="text-center p-10 rounded-[20px] !bg-cover py-14 px-5 flex flex-col items-center"
        style={{
          background:
            " linear-gradient(247deg, rgba(199, 242, 132, 0.05) 13.88%, rgba(0, 190, 240, 0.05) 99.28%), #0F161C",
        }}
      >
        <div className="text-[28px] md:text-[36px] font-extrabold text-green">
          $SOL FOR SOL
        </div>
        <p className="text-v2-lily/50 text-xs md:text-sm mt-10 md:mt-5 text-center max-w-[302px] md:max-w-[352px]">
          Connect wallet to check your allocation
        </p>
        <div className="!bg-transparent flex items-center justify-center mt-5 w-full css-1u9gcgi">
          <Main />
        </div>
      </div>
    </div>
  );
};

export default Content;
