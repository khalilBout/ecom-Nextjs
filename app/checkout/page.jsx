"use client";
import React, { useContext, useEffect, useState } from "react";
import ItemCard from "@/app/components/cardPage/ItemCard";

import { GlobalContext } from "@/services/context/GlobalContext";
import ItemCardCheckout from "../components/cardPage/ItemCardCheckout";
import EmptyCard from "../components/checkoutPage/EmptyCard";
import TotalsCart from "../components/checkoutPage/TotalsCart";
import Address from "../components/checkoutPage/Address";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { resetBasket } from "@/redux/CartSlice";
import toast from "react-hot-toast";

const Checkout = () => {
  const session = useSession();
  const cart = useSelector((state) => state.Cart.cartProducts);
  const dispatch = useDispatch();

  // const { cart, clearCart} = useContext(GlobalContext);
  const router = useRouter();
  const [addressClient, setAddressClient] = useState(null);

  const OrderData = {
    // userId: user?.id || null,
    userName: session?.data?.user.name || null,
    email: session?.data?.user.email || null,

    shippingAddress: {
      clientName: addressClient?.clientName,
      address: addressClient?.address,
      city: addressClient?.city,
      phone: addressClient?.phone,
      willai: addressClient?.willai,
    },
    orderItems: cart?.map((item) => ({
      productID: item.idProduct,
      titleProduct: item.titleProduct,
      idModel: item.idModel,
      Qt: item.Qt,
      Color: item.Color,
      imageModel: item.imageModel,
      sizeSelect: item.sizeSelect,
    })),
  };
  const sendOrder = async () => {
    console.log("order data:", OrderData);
    try {
      const response = await fetch("http://localhost:3000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OrderData),
      });

      if (response.status === 201) {
        clearCart();
        toast.success("add your Order ..");
        router.push("/");
      }
    } catch (e) {
      console.log(e);
      toast.error(e, "no product sending ...");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      {cart?.length > 0 ? (
        <>
          <div className="mdl:flex gap-4">
            <div className="w-full mdl:w-1/2 pb-20 ">
              <div className="mt-5">
                {cart?.map((item) => (
                  <div className="" key={item.titleProduct}>
                    <div className="sml:hidden">
                      <ItemCard item={item} />
                    </div>
                    <div className="hidden sml:block">
                      <ItemCardCheckout item={item} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                // onClick={clearCart}
                onClick={() => {
                  dispatch(resetBasket());
                  toast.success("your cart is empty ..");
                }}
                className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
              >
                Reset cart
              </button>
              {/* Totals Cart  */}
              <TotalsCart />
            </div>
            {/* user info  */}

            {/* Info Address  */}
            <div className="w-full mdl:w-1/2 mt-4">
              <div className="">
                {session.status === "loading" && <p>loading...</p>}
                {session.status === "authenticated" && (
                  <>
                    <p className="text-[22px] font-bold ">
                      Hi{" "}
                      <span className="text-[red]">
                        {" "}
                        {session?.data?.user.name}{" "}
                      </span>
                    </p>
                  </>
                )}
                {session.status === "unauthenticated" && (
                  <>
                    <h2 className="text-[20px]">you are not login </h2>
                    <Link
                      href="/login"
                      className="bg-green-200 px-3 py-1 rounded-lg cursor-pointer hover:bg-slate-400"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
              {addressClient === null ? (
                <>
                  <Address setAddressClient={setAddressClient} />
                </>
              ) : (
                <>
                  <h2 className="text-[red] text-3xl my-2">Client Info </h2>
                  <h3 className="text-xl mx-2">
                    Name:{addressClient.clientName}
                  </h3>
                  <h3 className="text-xl mx-2">Phone: {addressClient.phone}</h3>
                  <h3 className="text-xl mx-2">
                    Address: {addressClient.address}
                  </h3>
                  <h3 className="text-xl mx-2">City:{addressClient.city}</h3>
                  <h3 className="text-xl mx-2">
                    Willai:{addressClient.willai}
                  </h3>
                </>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={sendOrder}
              disabled={!addressClient}
              className={`${
                addressClient !== null
                  ? "bg-green-400 hover:bg-green-800 hover:text-white cursor-pointer"
                  : "bg-gray-500 hover:bg-gray-500 hover:text-gray-200"
              } w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300`}
            >
              Send Order
            </button>
          </div>
        </>
      ) : (
        <EmptyCard />
      )}
    </div>
  );
};

export default Checkout;
