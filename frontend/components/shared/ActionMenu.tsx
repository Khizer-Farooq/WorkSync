"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  items: ActionMenuItem[];
};

const ACTION_MENU_EVENT = "close-all-action-menus";

export default function ActionMenu({ items }: Props) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    openUp: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  function calculatePosition() {
    const button = buttonRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();

    const menuWidth = 192;
    const estimatedMenuHeight = Math.min(items.length * 40 + 16, 300);

    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUp = spaceBelow < estimatedMenuHeight;

    const top = shouldOpenUp
      ? rect.top - estimatedMenuHeight - 8
      : rect.bottom + 8;

    const left = Math.min(
      rect.right - menuWidth,
      window.innerWidth - menuWidth - 12
    );

    setPosition({
      top: Math.max(12, top),
      left: Math.max(12, left),
      openUp: shouldOpenUp,
    });
  }

  function toggleMenu() {
    if (!open) {
      window.dispatchEvent(new Event(ACTION_MENU_EVENT));
      calculatePosition();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function handleClick(item: ActionMenuItem) {
    setOpen(false);
    item.onClick();
  }

  useEffect(() => {
    function closeMenu() {
      setOpen(false);
    }

    window.addEventListener(ACTION_MENU_EVENT, closeMenu);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      window.removeEventListener(ACTION_MENU_EVENT, closeMenu);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      const clickedButton = buttonRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="rounded-lg p-2 hover:bg-gray-100"
      >
        <MoreVertical size={18} />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: 192,
              zIndex: 9999,
            }}
            className="rounded-xl border bg-white p-2 shadow-xl"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleClick(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}