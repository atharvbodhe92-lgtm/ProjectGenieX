import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { userProjects } = useSelector((state) => state.projects);

  return (
    <div>
      <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden rounded-lg shadow-xl">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex p-4 @container">
                <div className="flex w-full flex-col gap-4 items-center">
                  <div className="flex gap-4 flex-col items-center">
                    <div className="flex bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-[#0D414E] text-white font-bold min-h-32 w-32 items-center justify-center text-[3rem]">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                        {user?.name}
                      </p>
                      <p className="text-[#49739c] text-base font-normal leading-normal text-center">
                        {user?.email}
                      </p>
                      <p className="text-[#49739c] text-base font-normal leading-normal text-center">
                        {user?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-3">
                <div className="flex border-b border-[#cedbe8] px-4 gap-8">
                  <a
                    className="flex flex-col items-center justify-center border-b-[3px] border-b-[#0c7ff2] text-[#0d141c] pb-[13px] pt-4"
                    href="#"
                  >
                    <p className="text-[#0d141c] text-sm font-bold leading-normal tracking-[0.015em]">
                      User Info
                    </p>
                  </a>
                </div>
              </div>

              <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Projects
              </h2>

              {userProjects.length === 0 ? (
                <div className="p-4">
                  <p>No Projects Yet</p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-stretch justify-between gap-4 rounded-lg">
                    <div className="flex flex-[2_2_0px] flex-col gap-4">
                      {userProjects.map((project, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <p className="text-[#0d141c] text-base font-bold leading-tight">
                            {project.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional: Display full userProjects if you want more */}
              {/* <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Your Project List</h3>
                {userProjects.map((proj: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <p className="font-bold">{proj.title}</p>
                    <p className="text-sm text-gray-600">{proj.overview}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
