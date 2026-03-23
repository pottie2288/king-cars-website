'use client'

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  color?: string;
  skew?: number;
}

const MotionLink = motion.create(Link);

export const MenuVertical = ({
  menuItems = [],
  color = "#1d4ed8", // Default to king-blue
  skew = 0,
}: MenuVerticalProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {menuItems.map((item, index) => (
        <motion.div
          key={`${item.href}-${index}`}
          className="group/nav flex items-center gap-3 cursor-pointer text-gray-800"
          initial="initial"
          whileHover="hover"
        >
          <motion.div
            variants={{
              initial: { x: -20, color: "inherit", opacity: 0 },
              hover: { x: 0, color, opacity: 1 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="shrink-0"
          >
            <ArrowRight strokeWidth={2.5} className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>

          <MotionLink
            href={item.href}
            variants={{
              initial: { x: -30, color: "inherit" },
              hover: { x: 0, color, skewX: skew },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-bold text-2xl sm:text-3xl no-underline py-2"
          >
            {item.label}
          </MotionLink>
        </motion.div>
      ))}
    </div>
  );
};
