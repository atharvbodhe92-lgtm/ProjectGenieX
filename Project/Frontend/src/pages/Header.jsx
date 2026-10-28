import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { checkUserSession, logout } from "../services/authService";
import { useEffect } from "react";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
      checkUserSession(dispatch);
    }, [dispatch]);


  const handleLogout = async () => {
    await logout();
    dispatch(logoutUser());
    navigate("/login");
  };
 

  return (
    <header className="fixed z-50 top-0 flex shadow-md py-4 px-4 sm:px-10 bg-[#e3f5f8] min-h-[40px] tracking-wide w-full text-black">
      <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        <Link to="/" className="max-sm:hidden">
          <div className="text-2xl font-bold">Project GenieX</div>
        </Link>

        <div
              id="collapseMenu"
              className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
            >
              <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/'} className="hover:text-[#007bff] text-black block font-semibold text-md">
                    Home
                  </Link>
                </li>
                {
                  isAuthenticated && (
                    <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                      <Link to={'/dashboard'} className="hover:text-[#007bff] text-black block font-semibold text-md">
                        Dashboard
                      </Link>
                    </li>
                  )
                }
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/about'} className="hover:text-[#007bff] text-black block font-semibold text-md">
                    About
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/contact'} className="hover:text-[#007bff] text-black block font-semibold text-md">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

        <div className="flex max-lg:ml-auto space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-md rounded-full font-bold text-gray-500 border-2 bg-transparent hover:bg-gray-50 transition-all ease-in-out duration-300 cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 text-md rounded-full font-bold text-white border-2 bg-[#0d414e] transition-all ease-in-out duration-300 hover:bg-gray-700 cursor-pointer"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-md rounded-full font-bold text-white border-2 bg-[#0d414e] transition-all ease-in-out duration-300 hover:bg-gray-700 cursor-pointer"
            >
              Logout
            </button>
          )}

          <button id="toggleOpen" className="lg:hidden">
            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


{/* <div className="w-full p-3 shadow-sm flex justify-between items-center px-5 bg-[#A3A2E8] z-10 fixed">
  <Link to={"/"}>
    <img src="/logo.svg" />
  </Link>
  <div>
    <Link to={"/"}>
      <Button className="bg-[#4845D2] hover:bg-[#4745d2af]">
        Sign In
      </Button>
    </Link>
  </div>
</div> */}
