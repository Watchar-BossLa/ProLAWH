-- Fix critical security vulnerability: Add missing RLS policy for business_entity_documents
-- This table currently has no RLS policies, allowing unrestricted access

-- Add RLS policy for business_entity_documents table
CREATE POLICY "Users can view business entity documents they have access to"
ON public.business_entity_documents
FOR SELECT
USING (
  -- Allow if user is the uploader
  auth.uid() = uploaded_by OR
  -- Allow if user has admin role  
  has_user_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can insert business entity documents"
ON public.business_entity_documents
FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own business entity documents"
ON public.business_entity_documents
FOR UPDATE
USING (auth.uid() = uploaded_by OR has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own business entity documents"
ON public.business_entity_documents
FOR DELETE
USING (auth.uid() = uploaded_by OR has_user_role(auth.uid(), 'admin'));