import React from 'react';
import View from './view';
import { useNavigate } from 'react-router-dom';
import NotFound from './notFound';
import Button from '../components/button';
import { pizzaService } from '../service/service';
import { Franchise, FranchiseList, Role, Store, User } from '../service/pizzaService';
import { TrashIcon } from '../icons';

interface Props {
  user: User | null;
}

export default function AdminDashboard(props: Props) {
  const navigate = useNavigate();
  const [franchiseList, setFranchiseList] = React.useState<FranchiseList>({ franchises: [], more: false });
  const [franchisePage, setFranchisePage] = React.useState(0);
  const filterFranchiseRef = React.useRef<HTMLInputElement>(null);
  //users
  const [userList, setUserList] = React.useState<{ users: User[]; more: boolean }>({ users: [], more: false });
  const [userPage, setUserPage] = React.useState(0);
  const filterUserRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    (async () => {
      setFranchiseList(await pizzaService.getFranchises(franchisePage, 3, '*'));
    })();
  }, [props.user, franchisePage]);

  function createFranchise() {
    navigate('/admin-dashboard/create-franchise');
  }

  async function closeFranchise(franchise: Franchise) {
    navigate('/admin-dashboard/close-franchise', { state: { franchise: franchise } });
  }

  async function closeStore(franchise: Franchise, store: Store) {
    navigate('/admin-dashboard/close-store', { state: { franchise: franchise, store: store } });
  }

  async function filterFranchises() {
    setFranchiseList(await pizzaService.getFranchises(franchisePage, 10, `*${filterFranchiseRef.current?.value}*`));
  }

  // user
  React.useEffect(() => {
    (async () => {
      //setUserList(await pizzaService.getUsers(userPage, 5, '*'));
      const users = await pizzaService.getUsers(userPage, 5, filterUserRef.current?.value || '*');
      setUserList(users);
    })();
  }, [props.user, userPage]);

  const filterUsers = async () => {
    setUserPage(0);
    setUserList(await pizzaService.getUsers(0, 10, `*${filterUserRef.current?.value || ''}*`));
  };

  function deleteUser(user: User) {
    if (!user.id) {
      console.error('Cannot delete user: missing ID', user);
      return;
    }
  
    // remove user from front end
    setUserList((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== user.id),
    }));
  }
  
  
  

  
  let response = <NotFound />;
  if (Role.isRole(props.user, Role.Admin)) {
    response = (
      <View title="Mama Ricci's kitchen">

        {/* users table */}
        <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
          <h3 className="text-neutral-100 text-xl">Users</h3>
          <div className="bg-neutral-100 overflow-clip my-4">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                        <tr>
                          {['Name', 'Email', 'Roles', 'Action'].map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {userList.users.length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">
                              No users found
                            </td>
                            <td className="px-6 py-2 text-center">
                              <button
                                type="button"
                                className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                onClick={() => navigate('/admin-dashboard/user')}
                              >
                                <TrashIcon />
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                        {userList.users.map((user) => (
                          <tr key={user.id ?? `missing-${user.email}`} className="border-t-2 border-neutral-500">
                            <td className="px-6 py-2 text-left text-sm font-medium text-gray-800">{user.name ?? 'N/A'}</td>
                            <td className="px-6 py-2 text-left text-sm text-gray-700">{user.email ?? 'N/A'}</td>
                            <td className="px-6 py-2 text-left text-sm text-gray-700">
                              {user.roles?.map((r) => r.role).join(', ') || 'None'}
                            </td>
                            <td className="px-6 py-2 text-center text-sm font-medium">
                              <button
                                type="button"
                                className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800"
                                onClick={() => deleteUser(user)}
                              >
                                <TrashIcon />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setUserPage((p) => Math.max(0, p - 1))}
                        disabled={userPage <= 0}
                        className="px-2 py-1 border rounded-lg hover:bg-orange-200 disabled:bg-neutral-300"
                      >
                        «
                      </button>
                      <button
                        onClick={() => setUserPage((p) => p + 1)}
                        disabled={!userList.more}
                        className="px-2 py-1 border rounded-lg hover:bg-orange-200 disabled:bg-neutral-300"
                      >
                        »
                      </button>
                    </div>
                    {/* Filter */}
                    <div className="mt-2 flex gap-2">
                      <input
                        ref={filterUserRef}
                        placeholder="Filter by name"
                        className="px-2 py-1 border rounded-lg"
                      />
                      <button
                        onClick={filterUsers}
                        className="px-2 py-1 border rounded-lg hover:bg-orange-200"
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        

        {/* Franchise Table */}
        <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
          <h3 className="text-neutral-100 text-xl">Franchises</h3>
          <div className="bg-neutral-100 overflow-clip my-4">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                        <tr>
                          {['Franchise', 'Franchisee', 'Store', 'Revenue', 'Action'].map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      {franchiseList.franchises.map((franchise, findex) => {
                        return (
                          <tbody key={findex} className="divide-y divide-gray-200">
                            <tr className="border-neutral-500 border-t-2">
                              <td className="text-start px-2 whitespace-nowrap text-l font-mono text-orange-600">{franchise.name}</td>
                              <td className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800" colSpan={3}>
                                {franchise.admins?.map((o) => o.name).join(', ')}
                              </td>
                              <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                                <button type="button" className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400  hover:border-orange-800 hover:text-orange-800" onClick={() => closeFranchise(franchise)}>
                                  <TrashIcon />
                                  Close
                                </button>
                              </td>
                            </tr>

                            {franchise.stores.map((store, sindex) => {
                              return (
                                <tr key={sindex} className="bg-neutral-100">
                                  <td className="text-end px-2 whitespace-nowrap text-sm text-gray-800" colSpan={3}>
                                    {store.name}
                                  </td>
                                  <td className="text-end px-2 whitespace-nowrap text-sm text-gray-800">{store.totalRevenue?.toLocaleString()} ₿</td>
                                  <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                                    <button type="button" className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800" onClick={() => closeStore(franchise, store)}>
                                      <TrashIcon />
                                      Close
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        );
                      })}
                      <tfoot>
                        <tr>
                          <td className="px-1 py-1">
                            <input type="text" ref={filterFranchiseRef} name="filterFranchise" placeholder="Filter franchises" className="px-2 py-1 text-sm border border-gray-300 rounded-lg" />
                            <button type="submit" className="ml-2 px-2 py-1 text-sm font-semibold rounded-lg border border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800" onClick={filterFranchises}>
                              Submit
                            </button>
                          </td>
                          <td colSpan={4} className="text-end text-sm font-medium">
                            <button className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300 " onClick={() => setFranchisePage(franchisePage - 1)} disabled={franchisePage <= 0}>
                              «
                            </button>
                            <button className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300" onClick={() => setFranchisePage(franchisePage + 1)} disabled={!franchiseList.more}>
                              »
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button className="w-36 text-xs sm:text-sm sm:w-64" title="Add Franchise" onPress={createFranchise} />
        </div>
      </View>
    );
  }

  return response;
}
