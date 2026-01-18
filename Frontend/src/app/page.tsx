"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "@/lib/validations/formulario";
import {
  User,
  Phone,
  Users,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Upload,
  Calendar,
  MapPin,
  Heart,
  Mail,
  Home,
  FileDigit,
} from "lucide-react";
import FormWizard from "@/components/formwizard";
export default function FormularioWizard() {

    return <FormWizard/>
}