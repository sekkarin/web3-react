import { useEffect, useState, Fragment } from "react";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { ethers, parseUnits } from "ethers";
import { formatEther } from "@ethersproject/units";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  WalletIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import abi from "../../../Contract/abi.json";

const [metaMask, hooks] = initializeConnector(
  (action) => new MetaMask({ actions: action })
);
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;
const navigation = [
  { name: "Dashboard", href: "#", current: true },

  // { name: "Connect MetaMask", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const TOKEN = [
  {
    name: "KEN",
    conTract: "0x5a1301d99489931059f5e89138edfec7fe52648b",
  },
  {
    name: "KENJA",
    conTract: "0x916F25F8855E4C9E40A7e9C647b27dAeB90C43B7",
  },
];
const Home = () => {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();

  const [balance, setBalance] = useState("");
  const [contractAddress, setContractAddress] = useState(
    "0x5a1301d99489931059f5e89138edfec7fe52648b"
  );
  const [myAccount, setMyAccount] = useState("");
  const [hash, setHash] = useState("");
  const [buyToken, setBuyToken] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const contractChain = 11155111;

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  useEffect(() => {
    (async () => {
      const signer: any = provider?.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      if (accounts != undefined) {
        // const myBalance = await smartContract.
        const myBalance = await smartContract.balanceOf(accounts[0]);
        setMyAccount(accounts[0]);
        setBalance(formatEther(myBalance));
      }
    })();
  }, [accounts, isActive, provider, contractAddress]);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
  };

  const handleBuyToken = async () => {
    if (parseInt(buyToken) < 0) {
      return;
    }
    try {
      setIsloading(true);
      console.log(buyToken);

      const signer: any = provider?.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const valueConvertEther = parseUnits(buyToken.toString(), "ether");
      // console.log({ valueConvertEther });

      const tx = await smartContract.buy({
        value: valueConvertEther,
      });
      smartContract.on("Transfer", (form, to, tokens) => {
        // console.log({ form, to, tokens, tx });
        const tokenFloat: number = parseFloat(formatEther(tokens));
        const balanceFloat: number = parseFloat(balance);
        const total = tokenFloat + balanceFloat;
        setBalance(total.toString());
        setBuyToken("");
      });
      console.log(tx.hash);
      setHash(tx.hash);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-t from-purple-200 to-pink-50">
        <Disclosure as="nav" className="bg-transparent">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {isActive !== true ? (
                      <button
                        type="button"
                        className="inline-flex gap-1 bg-transparent  rounded-full  p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        onClick={handleConnect}
                      >
                        <p className="">Connect MetaMask</p>
                        <WalletIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex gap-1 bg-transparent  rounded-full  p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        onClick={handleDisconnect}
                      >
                        <p className="">Disconnect MetaMask</p>
                        <WalletIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                    {isActive && (
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 text-ellipsis overflow-hidden"
                                  )}
                                >
                                  ID: {accounts}
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 text-ellipsis overflow-hidden"
                                  )}
                                >
                                  balance: {balance}
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <main>
          <div className="grid grid-cols-1 items-center md:grid-cols-2">
            <div className="p-2 ">
              <h2 className="text-black font-bold text-lg text-center">
                BUY CRYPTO
              </h2>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <PlusIcon className="h-2 w-2" aria-hidden="true" />
                  </div>
                  <input
                    type="number"
                    onChange={(e) => {
                      setBuyToken(e.target.value);
                    }}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      onChange={(e) => {
                        setContractAddress(e.target.value);
                      }}
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      {TOKEN.map((token) => (
                        <option key={token.conTract} value={token.conTract}>
                          {token.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button
                className="bg-green-500 w-full py-2 mt-2 rounded-md text-gray-300 hover:text-white hover:bg-green-400"
                onClick={handleBuyToken}
              >
                {isLoading ? "loading..." : "BUY"}
              </button>
              {hash != "" ? (
                <a href={`https://sepolia.etherscan.io/tx/${hash}`}>
                  <p className=" text-ellipsis overflow-hidden mt-2 text-blue-500">
                    {hash}
                  </p>
                </a>
              ) : null}
            </div>
            <div className="order-1">
              <p>
                <img
                  src="https://raw.githubusercontent.com/RSurya99/nefa/main/assets/img/advanced-trading-tools.webp"
                  alt=""
                />
              </p>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
};

export default Home;
