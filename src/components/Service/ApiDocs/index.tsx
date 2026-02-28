import Image from "next/image";
import Link from "next/link";
import { SessionData } from "@/libs/session";
import { useState, useEffect, Dispatch } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useGlobalState } from "@/context/globalState";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";
import Tags, { TagsType } from '@/components/Tags';

import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { FolderOpen, Dot, Box, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { Apis, Api } from "@/libs/apis";
import React from "react";
import { cva } from "class-variance-authority";
import DataTable from "@/components/DataTable";
import TabContent from "../../TabContent";
import Textbox from "../../Textbox";
import Button from "../../Button";
import { uuid } from "@/libs/functions";

import Parameters, { DataType } from "@/components/Service/ApiDocs/Parameters";

type collapsedType = {
  key: string;
  collapsed: boolean
}

// definr variants
const variants = cva(
  "flex flex-col gap-1 overflow-hidden",
  {
    variants: {
      collapsed: {
        true: "collapsed",
        false: ""
      }
    },
  }
);

export default function ApiDocs({ session, service }: { session: SessionData, service: Api }) {
  const router = useRouter();
  const pathname = usePathname();

  // [
  //   { method: "GET", link: "Search User", color: "text-green-400" },
  //   { method: "POST", link: "http://172.30.10.10:3000/api/v1/test", color: "text-yellow-400" },
  //   { method: "PUT", link: "http://172.30.10.10:3000/api/v1/test", color: "text-blue-400" },
  //   { method: "PATCH", link: "http://172.30.10.10:3000/api/v1/test", color: "text-violet-400" },
  //   { method: "DELETE", link: "http://172.30.10.10:3000/api/v1/test", color: "text-red-400" },
  //   { method: "HEAD", link: "http://172.30.10.10:3000/api/v1/test", color: "text-green-400" },
  //   { method: "OPTIONS", link: "http://172.30.10.10:3000/api/v1/test", color: "text-pink-400" },
  // ]

  const { addToast } = useToast();
  const { showProgress } = useProgress();
  const { theme } = useGlobalState();
  const [endpoints, setEndpoints] = useState<any>();
  const [schemas, setSchemas] = useState<any>();
  const [collapsed, setCollapsed] = useState<collapsedType[]>([]);
  const [apiOperationId, setApiOperationId] = useState<string>();
  const [apiDoc, setApiDoc] = useState<any>();
  const [parameters, setParameters] = useState<DataType[]>();

  const getColor = (method: string) => {
    let color: string;

    switch (method) {
      case "GET":
        color = "method-get";
        break;
      case "POST":
        color = "method-post";
        break;
      case "PUT":
        color = "method-put";
        break;
      case "PATCH":
        color = "method-patch";
        break;
      case "DELETE":
        color = "method-delete";
        break;
      case "HEAD":
        color = "method-head";
        break;
      case "OPTIONS":
        color = "method-options";
        break;
      default:
        color = "method-unknown";
    }

    return color;
  }

  const loadOpenApiDocList = () => {
    // get docs
    // const docs: any = {
    //   "openapi": "3.1.0",
    //   "info": {
    //     "title": "Job Requisition Module API",
    //     "description": "Job Requisition Module of Somnetics Automated HR Recruitment Application",
    //     "version": "<version>"
    //   },
    //   "servers": [
    //     {
    //       "url": "http://localhost:5001",
    //       "description": "Generated server url"
    //     }
    //   ],
    //   "paths": {
    //     "/api/v1/requisitions/{id}/update-state": {
    //       "put": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "operationId": "updateJobRequisitionState",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "minLength": 1,
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             }
    //           }
    //         ],
    //         "requestBody": {
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/JobRequisitionStateUpdatePayloadAsReq"
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "OK",
    //             "content": {
    //               "*/*": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ResponseWrapperResponseBuilderJobRequisitionStateUpdateResultAsResp"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions/{id}/recommend-candidates": {
    //       "put": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Recommend candidates for a job requisition",
    //         "description": "Attaches sample candidate profiles to a job requisition for testing and demonstration purposes",
    //         "operationId": "recommendCandidates",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "description": "UUID of the job requisition",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "379aa447-9557-42c1-856e-26f32f7da56c"
    //           }
    //         ],
    //         "responses": {
    //           "200": {
    //             "description": "Candidates successfully recommended and attached",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                     "status": "pending",
    //                     "candidate_profiles": [
    //                       {
    //                         "candidate_id": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                         "state": "pending"
    //                       }
    //                     ],
    //                     "message": "Candidates successfully recommended and attached to the requisition."
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 404,
    //                     "error": "Not Found",
    //                     "code": "JOB_REQUISITION_NOT_FOUND",
    //                     "message": "Job requisition with ID '379aa447-9557-42c1-856e-26f32f7da56c' was not found.",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/recommend-candidates",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/recommend-candidates",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions/{id}/propose-budget": {
    //       "put": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Propose budget for a job requisition",
    //         "description": "Updates a job requisition with budget limit and changes state to BUDGET_PROPOSED",
    //         "operationId": "proposeBudgetToRequisition",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "description": "UUID of the job requisition",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "2252e74f-edcc-4112-bed4-966dbc3d922c"
    //           }
    //         ],
    //         "requestBody": {
    //           "description": "Budget proposal payload",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/JobRequisitionBudgetProposalPayloadAsAReq"
    //               },
    //               "example": {
    //                 "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                 "task_name": "budget_proposal",
    //                 "budget_limit": 50000
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "Budget proposal successfully submitted",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/JobRequisitionBudgetProposalResultAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                     "budget_limit": 50000,
    //                     "submitted_by": "finance.manager@company.com",
    //                     "submitted_at": "2025-07-15 14:49:39",
    //                     "timezone": "Asia/Kolkata",
    //                     "message": "Budget proposal successfully submitted."
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "400": {
    //             "description": "Bad Request",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions/{id}/candidates/{candidateId}": {
    //       "get": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Get candidate profile for a job requisition",
    //         "description": "Retrieves the profile of a specific candidate associated with a job requisition",
    //         "operationId": "getCandidateProfile",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "description": "UUID of the job requisition",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "379aa447-9557-42c1-856e-26f32f7da56c"
    //           },
    //           {
    //             "name": "candidateId",
    //             "in": "path",
    //             "description": "UUID of the candidate",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df"
    //           }
    //         ],
    //         "responses": {
    //           "200": {
    //             "description": "Candidate profile successfully retrieved",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "candidate_id": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "status": "recommended"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "400": {
    //             "description": "Bad Request",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 400,
    //                     "error": "Bad Request",
    //                     "code": "VALIDATION_FAILURE",
    //                     "message": "Validation failed.",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "details": [
    //                       {
    //                         "field": "requisitionId",
    //                         "issue": "Requisition ID must not be blank."
    //                       }
    //                     ],
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 404,
    //                     "error": "Not Found",
    //                     "code": "CANDIDATE_PROFILE_NOT_FOUND",
    //                     "message": "Candidate profile with ID '7d767e93-7a61-4a5b-8cc6-dc2c0601f3df' was not found in requisition '379aa447-9557-42c1-856e-26f32f7da56c'.",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       },
    //       "put": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Update candidate profile for a job requisition",
    //         "description": "Updates the profile of a specific candidate associated with a job requisition",
    //         "operationId": "updateCandidateProfile",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "description": "UUID of the job requisition",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "379aa447-9557-42c1-856e-26f32f7da56c"
    //           },
    //           {
    //             "name": "candidateId",
    //             "in": "path",
    //             "description": "UUID of the candidate",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df"
    //           }
    //         ],
    //         "requestBody": {
    //           "description": "Candidate profile update payload",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/CandidateProfileUpdatePayloadAsReq"
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "Candidate profile successfully updated",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
    //                 }
    //               }
    //             }
    //           },
    //           "400": {
    //             "description": "Bad Request",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 400,
    //                     "error": "Bad Request",
    //                     "code": "VALIDATION_FAILURE",
    //                     "message": "Validation failed.",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "details": [
    //                       {
    //                         "field": "requisitionId",
    //                         "issue": "Requisition ID must not be blank."
    //                       }
    //                     ],
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 404,
    //                     "error": "Not Found",
    //                     "code": "CANDIDATE_PROFILE_NOT_FOUND",
    //                     "message": "Candidate profile with ID '7d767e93-7a61-4a5b-8cc6-dc2c0601f3df' was not found in requisition '379aa447-9557-42c1-856e-26f32f7da56c'.",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions/{id}/candidates/shortlist": {
    //       "put": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Shortlist candidate profiles",
    //         "description": "Shortlist candidate profiles associated to a job requisition",
    //         "operationId": "shortlistCandidateProfiles",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "description": "UUID of the job requisition",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "2252e74f-edcc-4112-bed4-966dbc3d922c"
    //           }
    //         ],
    //         "requestBody": {
    //           "description": "Candidate Profiles Shortlisting payload",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/CandidateProfilesShortlistingPayloadAsReq"
    //               },
    //               "example": {
    //                 "candidate_profiles": [
    //                   {
    //                     "id": "6c5008d1-f247-429a-b6b2-5473ec5eb652",
    //                     "action": "Shortlist"
    //                   },
    //                   {
    //                     "id": "732c564b-97df-453b-aa30-079bcd4de794",
    //                     "action": "Shortlist"
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "Candidate profiles shortlisted successfully",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/CandidateProfilesShortlistingResultAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "requisition_id": "2252e74f-edcc-4112-bed4-966dbc3d922c",
    //                     "fulfillment_id": "eea2a63e-3a2b-4486-9d28-e39412f219ce",
    //                     "message": "Candidate profiles shortlisted successfully."
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "400": {
    //             "description": "Bad Request",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 400,
    //                     "error": "Bad Request",
    //                     "code": "JOB_REQUISITION_NOT_YET_APPROVED",
    //                     "message": "Job requisition with ID 'e80ee3de-4398-4473-9a78-95a6d3faf885' has not been approved yet.",
    //                     "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-95a6d3faf885/candidates/shortlist",
    //                     "timestamp": "2025-07-24T05:12:53.801552044Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 404,
    //                     "error": "Not Found",
    //                     "code": "JOB_REQUISITION_NOT_FOUND",
    //                     "message": "Job requisition with ID 'e80ee3de-4398-4473-9a78-94a6d3faf885' was not found.",
    //                     "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-94a6d3faf885/candidates/shortlist",
    //                     "timestamp": "2025-07-24T05:13:54.546687260Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-94a6d3faf885/candidates/shortlist",
    //                     "timestamp": "2025-07-24T05:13:54.546687260Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions/{id}/attach-fulfillment": {
    //       "put": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "operationId": "attachFulfillment",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "minLength": 1,
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             }
    //           }
    //         ],
    //         "requestBody": {
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/JobRequisitionFulfillmentAttachmentPayloadAsReq"
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "OK",
    //             "content": {
    //               "*/*": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ResponseWrapperResponseBuilderJobRequisitionFulfillmentAttachmentResultAsResp"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/workflow/terminate": {
    //       "post": {
    //         "tags": [
    //           "workflow-controller-impl"
    //         ],
    //         "summary": "Terminate an active workflow process",
    //         "description": "Forcefully terminates a running workflow instance identified by tenant and correlation ID.",
    //         "operationId": "terminateWorkflow",
    //         "requestBody": {
    //           "description": "Payload identifying the workflow process to terminate",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/WorkflowTerminationClientPayloadAsReq"
    //               },
    //               "example": {
    //                 "tenant_id": "tenant-001",
    //                 "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c"
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "Workflow successfully terminated",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/MessageAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "message": "Workflow termination successful"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "Workflow termination failed",
    //                     "path": "/api/v1/workflow/terminate",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/workflow/initiate": {
    //       "post": {
    //         "tags": [
    //           "workflow-controller-impl"
    //         ],
    //         "summary": "Initiate a new workflow process",
    //         "description": "Starts a new workflow instance in the BPMN engine based on the provided process details.",
    //         "operationId": "initiateWorkflow",
    //         "parameters": [
    //           {
    //             "name": "Authorization",
    //             "in": "header",
    //             "required": false,
    //             "schema": {
    //               "type": "string"
    //             }
    //           }
    //         ],
    //         "requestBody": {
    //           "description": "Workflow initiation payload containing process and tenant details",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/ProcessInstanceInitiationClientPayloadAsReq"
    //               },
    //               "example": {
    //                 "tenant_id": "tenant-001",
    //                 "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                 "bpmn_process_id": "job_requisition_process",
    //                 "bpmn_process_version": 2,
    //                 "variables": {
    //                   "requisitionId": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                   "priority": "high"
    //                 }
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "Workflow process successfully initiated",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/MessageAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "message": "Process initiation successful"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "Process initiation failed",
    //                     "path": "/api/v1/workflow/initiate",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/workflow/complete-user-task": {
    //       "post": {
    //         "tags": [
    //           "workflow-controller-impl"
    //         ],
    //         "summary": "Complete a user task in an active workflow",
    //         "description": "Marks a specific user task as completed and optionally updates process variables.",
    //         "operationId": "completeUserTask",
    //         "parameters": [
    //           {
    //             "name": "Authorization",
    //             "in": "header",
    //             "required": false,
    //             "schema": {
    //               "type": "string"
    //             }
    //           }
    //         ],
    //         "requestBody": {
    //           "description": "Payload containing user task details for completion",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/UserTaskCompletionClientPayloadAsReq"
    //               },
    //               "example": {
    //                 "tenant_id": "tenant-001",
    //                 "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                 "task_definition_id": "approve_job_requisition",
    //                 "task_assignee": "manager@company.com",
    //                 "variables": {
    //                   "requisitionId": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                   "approvalStatus": "approved"
    //                 }
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "200": {
    //             "description": "User task successfully completed",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/MessageAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "message": "User Task completion successful"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "User Task completion failed",
    //                     "path": "/api/v1/workflow/complete-user-task",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions": {
    //       "get": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Retrieve all job requisitions",
    //         "description": "Returns a list of all job requisitions based on parameters",
    //         "operationId": "getAllJobRequisitions",
    //         "parameters": [
    //           {
    //             "name": "status",
    //             "in": "query",
    //             "description": "Status of the job requisition",
    //             "required": false,
    //             "schema": {
    //               "type": "string",
    //               "enum": [
    //                 "pending",
    //                 "rejected",
    //                 "approved",
    //                 "processing"
    //               ]
    //             }
    //           },
    //           {
    //             "name": "skip",
    //             "in": "query",
    //             "description": "Skip N job requisitions from top",
    //             "required": false,
    //             "schema": {
    //               "type": "integer",
    //               "default": 0
    //             }
    //           },
    //           {
    //             "name": "limit",
    //             "in": "query",
    //             "description": "Limit number of requisitions to retrieve",
    //             "required": false,
    //             "schema": {
    //               "type": "integer",
    //               "default": 100
    //             }
    //           },
    //           {
    //             "name": "page",
    //             "in": "query",
    //             "description": "Zero-based page index (0..N)",
    //             "schema": {
    //               "type": "integer",
    //               "default": 0
    //             }
    //           },
    //           {
    //             "name": "size",
    //             "in": "query",
    //             "description": "The size of the page to be returned",
    //             "schema": {
    //               "type": "integer",
    //               "default": 10
    //             }
    //           }
    //         ],
    //         "responses": {
    //           "200": {
    //             "description": "All job requisitions successfully retrieved",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "content": [
    //                       {
    //                         "requisition_id": "6b0178f9-95ef-4f5f-94b0-88f33e9105c2",
    //                         "status": "pending",
    //                         "job_description": {
    //                           "title": "Software Engineer",
    //                           "description": "Develop and maintain Java-based backend systems.",
    //                           "department": "Engineering",
    //                           "location": "Bangalore",
    //                           "experience_required": 3,
    //                           "skills_required": "Java, Spring Boot, MySQL",
    //                           "qualifications_required": "B.Tech in Computer Science"
    //                         },
    //                         "positions_count": 2,
    //                         "priority": "high",
    //                         "target_hire_date": "2025-06-01 00:00:00",
    //                         "submitted_by": "anita.singh@company.com",
    //                         "submitted_at": "2025-07-22 19:19:51",
    //                         "timezone": "Asia/Kolkata"
    //                       },
    //                       {
    //                         "requisition_id": "dea25ba4-4d9c-4d53-bfeb-7bd721a547f3",
    //                         "status": "pending",
    //                         "job_description": {
    //                           "title": "Software Engineer",
    //                           "description": "Develop and maintain Java-based backend systems.",
    //                           "department": "Engineering",
    //                           "location": "Bangalore",
    //                           "experience_required": 3,
    //                           "skills_required": "Java, Spring Boot, MySQL",
    //                           "qualifications_required": "B.Tech in Computer Science"
    //                         },
    //                         "positions_count": 2,
    //                         "priority": "high",
    //                         "target_hire_date": "2025-06-01 00:00:00",
    //                         "submitted_by": "anita.singh@company.com",
    //                         "submitted_at": "2025-07-21 18:21:40",
    //                         "timezone": "Asia/Kolkata"
    //                       }
    //                     ],
    //                     "number_of_elements": 2,
    //                     "total_elements": 2,
    //                     "total_pages": 1,
    //                     "page_size": 10,
    //                     "page_number": 0,
    //                     "offset": 0,
    //                     "sorted": false,
    //                     "first": true,
    //                     "last": true,
    //                     "empty": false
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 404,
    //                     "error": "Not Found",
    //                     "code": "JOB_REQUISITION_NOT_FOUND",
    //                     "message": "No job requisitions were found.",
    //                     "path": "/api/v1/requisitions",
    //                     "timestamp": "2025-07-23T09:11:37.209218174Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions",
    //                     "timestamp": "2025-07-23T09:12:56.760253721Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       },
    //       "post": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Create a new job requisition",
    //         "description": "Adds a new job requisition with the provided details",
    //         "operationId": "submitJobRequisition",
    //         "parameters": [
    //           {
    //             "name": "Authorization",
    //             "in": "header",
    //             "required": false,
    //             "schema": {
    //               "type": "string"
    //             }
    //           }
    //         ],
    //         "requestBody": {
    //           "description": "Job requisition creation payload",
    //           "content": {
    //             "application/json": {
    //               "schema": {
    //                 "$ref": "#/components/schemas/JobRequisitionSubmissionPayloadAsReq"
    //               },
    //               "example": {
    //                 "job_description": {
    //                   "title": "Software Engineer",
    //                   "description": "Develop and maintain Java-based backend systems.",
    //                   "department": "Engineering",
    //                   "location": "Bangalore",
    //                   "experience_required": 3,
    //                   "skills_required": "Java, Spring Boot, MySQL",
    //                   "qualifications_required": "B.Tech in Computer Science"
    //                 },
    //                 "positions_count": 2,
    //                 "target_hire_date": "2025-06-01",
    //                 "priority": "high",
    //                 "submitted_by": "anita.singh@company.com",
    //                 "submitted_at": "2025-05-13 12:05:36",
    //                 "timezone": "Asia/Kolkata"
    //               }
    //             }
    //           },
    //           "required": true
    //         },
    //         "responses": {
    //           "201": {
    //             "description": "Job requisition successfully submitted",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/JobRequisitionSubmissionResultAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
    //                     "submitted_by": "anita.singh@company.com",
    //                     "submitted_at": "2025-07-15 14:49:39",
    //                     "timezone": "Asia/Kolkata",
    //                     "message": "Job requisition successfully submitted."
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "400": {
    //             "description": "Bad Request",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 400,
    //                     "error": "Bad Request",
    //                     "code": "VALIDATION_FAILURE",
    //                     "message": "Validation failed.",
    //                     "path": "/api/v1/requisitions",
    //                     "details": [
    //                       {
    //                         "field": "job_description.title",
    //                         "issue": "Title must not be blank."
    //                       },
    //                       {
    //                         "field": "positions_count",
    //                         "issue": "Positions count must not be null."
    //                       }
    //                     ],
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions",
    //                     "timestamp": "2025-07-15T09:24:45.141764613Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/requisitions/{id}": {
    //       "get": {
    //         "tags": [
    //           "job-requisition-controller-impl"
    //         ],
    //         "summary": "Retrieve a job requisition by ID",
    //         "description": "Returns a specific job requisition based on the provided ID",
    //         "operationId": "getJobRequisitionById",
    //         "parameters": [
    //           {
    //             "name": "id",
    //             "in": "path",
    //             "description": "UUID of the job requisition",
    //             "required": true,
    //             "schema": {
    //               "type": "string",
    //               "format": "uuid",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "example": "dea25ba4-4d9c-4d53-bfeb-7bd821a547f3"
    //           }
    //         ],
    //         "responses": {
    //           "200": {
    //             "description": "Job requisition successfully retieved",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
    //                 },
    //                 "example": {
    //                   "success": true,
    //                   "payload": {
    //                     "requisition_id": "dea25ba4-4d9c-4d53-bfeb-7bd721a547f3",
    //                     "status": "pending",
    //                     "job_description": {
    //                       "title": "Software Engineer",
    //                       "description": "Develop and maintain Java-based backend systems.",
    //                       "department": "Engineering",
    //                       "location": "Bangalore",
    //                       "experience_required": 3,
    //                       "skills_required": "Java, Spring Boot, MySQL",
    //                       "qualifications_required": "B.Tech in Computer Science"
    //                     },
    //                     "positions_count": 2,
    //                     "priority": "high",
    //                     "target_hire_date": "2025-06-01 00:00:00",
    //                     "submitted_by": "anita.singh@company.com",
    //                     "submitted_at": "2025-07-21 18:21:40",
    //                     "timezone": "Asia/Kolkata"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "404": {
    //             "description": "Not Found",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 404,
    //                     "error": "Not Found",
    //                     "code": "JOB_REQUISITION_NOT_FOUND",
    //                     "message": "Job requisition with ID 'dea25ba4-4d9c-4d53-bfeb-7bd821a547f3' was not found.",
    //                     "path": "/api/v1/requisitions/dea25ba4-4d9c-4d53-bfeb-7bd821a547f3",
    //                     "timestamp": "2025-07-23T07:30:55.661277606Z"
    //                   }
    //                 }
    //               }
    //             }
    //           },
    //           "500": {
    //             "description": "Internal System Error",
    //             "content": {
    //               "application/json": {
    //                 "schema": {
    //                   "$ref": "#/components/schemas/ErrorResponse"
    //                 },
    //                 "example": {
    //                   "success": false,
    //                   "payload": {
    //                     "status": 500,
    //                     "error": "Internal Server Error",
    //                     "code": "INTERNAL_SYSTEM_FAILURE",
    //                     "message": "<FAILURE_MESSAGE>",
    //                     "path": "/api/v1/requisitions/dea25ba4-4d9c-4d53-bfeb-7bd821a547f3",
    //                     "timestamp": "2025-07-23T07:38:33.520324497Z"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/authentication/userinfo": {
    //       "get": {
    //         "tags": [
    //           "authentication-controller"
    //         ],
    //         "operationId": "getUserInfo",
    //         "parameters": [
    //           {
    //             "name": "Access-Token",
    //             "in": "header",
    //             "required": true,
    //             "schema": {
    //               "type": "string"
    //             }
    //           }
    //         ],
    //         "responses": {
    //           "200": {
    //             "description": "OK",
    //             "content": {
    //               "*/*": {
    //                 "schema": {
    //                   "type": "object"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/authentication/token": {
    //       "get": {
    //         "tags": [
    //           "authentication-controller"
    //         ],
    //         "operationId": "exchangeCode",
    //         "parameters": [
    //           {
    //             "name": "code",
    //             "in": "query",
    //             "required": true,
    //             "schema": {
    //               "type": "string"
    //             }
    //           }
    //         ],
    //         "responses": {
    //           "200": {
    //             "description": "OK",
    //             "content": {
    //               "*/*": {
    //                 "schema": {
    //                   "type": "object"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "/api/v1/authentication/auth-url": {
    //       "get": {
    //         "tags": [
    //           "authentication-controller"
    //         ],
    //         "operationId": "getAuthUrl",
    //         "responses": {
    //           "200": {
    //             "description": "OK",
    //             "content": {
    //               "*/*": {
    //                 "schema": {
    //                   "type": "object"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },
    //   "components": {
    //     "schemas": {
    //       "JobRequisitionStateUpdatePayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_state": {
    //             "type": "string",
    //             "minLength": 1
    //           }
    //         }
    //       },
    //       "ErrorDetail": {
    //         "type": "object",
    //         "properties": {
    //           "field": {
    //             "type": "string"
    //           },
    //           "issue": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "ErrorResponse": {
    //         "type": "object",
    //         "properties": {
    //           "timestamp": {
    //             "type": "string"
    //           },
    //           "status": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "error": {
    //             "type": "string"
    //           },
    //           "code": {
    //             "type": "string"
    //           },
    //           "message": {
    //             "type": "string"
    //           },
    //           "path": {
    //             "type": "string"
    //           },
    //           "details": {
    //             "type": "array",
    //             "items": {
    //               "$ref": "#/components/schemas/ErrorDetail"
    //             }
    //           }
    //         }
    //       },
    //       "ResponseBuilderJobRequisitionStateUpdateResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_id": {
    //             "type": "string"
    //           },
    //           "message": {
    //             "type": "string"
    //           },
    //           "timestamp": {
    //             "type": "string"
    //           },
    //           "status": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "error": {
    //             "type": "string"
    //           },
    //           "code": {
    //             "type": "string"
    //           },
    //           "path": {
    //             "type": "string"
    //           },
    //           "details": {
    //             "type": "array",
    //             "items": {
    //               "$ref": "#/components/schemas/ErrorDetail"
    //             }
    //           }
    //         }
    //       },
    //       "ResponseWrapperResponseBuilderJobRequisitionStateUpdateResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "success": {
    //             "type": "boolean"
    //           },
    //           "payload": {
    //             "$ref": "#/components/schemas/ResponseBuilderJobRequisitionStateUpdateResultAsResp"
    //           }
    //         }
    //       },
    //       "CandidateProfileMetadataAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "candidate_id": {
    //             "type": "string"
    //           },
    //           "status": {
    //             "type": "string"
    //           },
    //           "candidate_name": {
    //             "type": "string"
    //           },
    //           "email": {
    //             "type": "string"
    //           },
    //           "location": {
    //             "type": "string"
    //           },
    //           "experience": {
    //             "type": "number",
    //             "format": "double"
    //           },
    //           "skills": {
    //             "type": "array",
    //             "items": {
    //               "type": "string"
    //             }
    //           },
    //           "resume": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "JobDescriptionMetadataAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "title": {
    //             "type": "string"
    //           },
    //           "description": {
    //             "type": "string"
    //           },
    //           "department": {
    //             "type": "string"
    //           },
    //           "location": {
    //             "type": "string"
    //           },
    //           "experience_required": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "skills_required": {
    //             "type": "string"
    //           },
    //           "qualifications_required": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "JobRequisitionMetadataAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_id": {
    //             "type": "string"
    //           },
    //           "fulfillment_ids": {
    //             "type": "array",
    //             "items": {
    //               "type": "string"
    //             }
    //           },
    //           "status": {
    //             "type": "string"
    //           },
    //           "job_description": {
    //             "$ref": "#/components/schemas/JobDescriptionMetadataAsResp"
    //           },
    //           "positions_count": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "priority": {
    //             "type": "string"
    //           },
    //           "target_hire_date": {
    //             "type": "string"
    //           },
    //           "candidate_profiles": {
    //             "type": "array",
    //             "items": {
    //               "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
    //             }
    //           },
    //           "submitted_by": {
    //             "type": "string"
    //           },
    //           "submitted_at": {
    //             "type": "string"
    //           },
    //           "timezone": {
    //             "type": "string"
    //           },
    //           "budget_limit": {
    //             "type": "number",
    //             "format": "float"
    //           }
    //         }
    //       },
    //       "JobRequisitionBudgetProposalPayloadAsAReq": {
    //         "type": "object",
    //         "properties": {
    //           "budget_limit": {
    //             "type": "number",
    //             "format": "float"
    //           }
    //         }
    //       },
    //       "JobRequisitionBudgetProposalResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_id": {
    //             "type": "string"
    //           },
    //           "budget_limit": {
    //             "type": "number",
    //             "format": "float"
    //           },
    //           "submitted_by": {
    //             "type": "string"
    //           },
    //           "submitted_at": {
    //             "type": "string"
    //           },
    //           "timezone": {
    //             "type": "string"
    //           },
    //           "message": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "CandidateProfileUpdatePayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "candidate_state": {
    //             "type": "string",
    //             "minLength": 1,
    //             "pattern": "(?i)^(onboard|onboarding|reject|rejected)$"
    //           }
    //         }
    //       },
    //       "CandidateProfile": {
    //         "type": "object",
    //         "properties": {
    //           "id": {
    //             "type": "string",
    //             "minLength": 1,
    //             "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //           },
    //           "action": {
    //             "type": "string",
    //             "minLength": 1
    //           }
    //         }
    //       },
    //       "CandidateProfilesShortlistingPayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "candidate_profiles": {
    //             "type": "array",
    //             "items": {
    //               "$ref": "#/components/schemas/CandidateProfile"
    //             },
    //             "minItems": 1
    //           }
    //         }
    //       },
    //       "CandidateProfilesShortlistingResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_id": {
    //             "type": "string"
    //           },
    //           "fulfillment_id": {
    //             "type": "string"
    //           },
    //           "message": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "JobRequisitionFulfillmentAttachmentPayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "fulfillment_ids": {
    //             "type": "array",
    //             "items": {
    //               "type": "string",
    //               "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
    //             },
    //             "minItems": 1
    //           }
    //         }
    //       },
    //       "ResponseBuilderJobRequisitionFulfillmentAttachmentResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_id": {
    //             "type": "string"
    //           },
    //           "fulfillment_ids": {
    //             "type": "array",
    //             "items": {
    //               "type": "string"
    //             }
    //           },
    //           "message": {
    //             "type": "string"
    //           },
    //           "timestamp": {
    //             "type": "string"
    //           },
    //           "status": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "error": {
    //             "type": "string"
    //           },
    //           "code": {
    //             "type": "string"
    //           },
    //           "path": {
    //             "type": "string"
    //           },
    //           "details": {
    //             "type": "array",
    //             "items": {
    //               "$ref": "#/components/schemas/ErrorDetail"
    //             }
    //           }
    //         }
    //       },
    //       "ResponseWrapperResponseBuilderJobRequisitionFulfillmentAttachmentResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "success": {
    //             "type": "boolean"
    //           },
    //           "payload": {
    //             "$ref": "#/components/schemas/ResponseBuilderJobRequisitionFulfillmentAttachmentResultAsResp"
    //           }
    //         }
    //       },
    //       "WorkflowTerminationClientPayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "tenant_id": {
    //             "type": "string"
    //           },
    //           "correlation_id": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "MessageAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "message": {
    //             "type": "string"
    //           }
    //         }
    //       },
    //       "ProcessInstanceInitiationClientPayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "tenant_id": {
    //             "type": "string"
    //           },
    //           "correlation_id": {
    //             "type": "string"
    //           },
    //           "bpmn_process_id": {
    //             "type": "string"
    //           },
    //           "bpmn_process_version": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "variables": {
    //             "type": "object",
    //             "additionalProperties": {
    //               "type": "object"
    //             }
    //           }
    //         }
    //       },
    //       "UserTaskCompletionClientPayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "tenant_id": {
    //             "type": "string"
    //           },
    //           "correlation_id": {
    //             "type": "string"
    //           },
    //           "task_definition_id": {
    //             "type": "string"
    //           },
    //           "task_assignee": {
    //             "type": "string"
    //           },
    //           "variables": {
    //             "type": "object",
    //             "additionalProperties": {
    //               "type": "object"
    //             }
    //           }
    //         }
    //       },
    //       "JobDescriptionPayload": {
    //         "type": "object",
    //         "properties": {
    //           "title": {
    //             "type": "string",
    //             "maxLength": 100,
    //             "minLength": 0
    //           },
    //           "description": {
    //             "type": "string",
    //             "maxLength": 5000,
    //             "minLength": 0
    //           },
    //           "department": {
    //             "type": "string",
    //             "maxLength": 50,
    //             "minLength": 0
    //           },
    //           "location": {
    //             "type": "string",
    //             "maxLength": 100,
    //             "minLength": 0
    //           },
    //           "experience_required": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "skills_required": {
    //             "type": "string",
    //             "maxLength": 500,
    //             "minLength": 0
    //           },
    //           "qualifications_required": {
    //             "type": "string",
    //             "maxLength": 500,
    //             "minLength": 0
    //           }
    //         },
    //         "required": [
    //           "experience_required"
    //         ]
    //       },
    //       "JobRequisitionSubmissionPayloadAsReq": {
    //         "type": "object",
    //         "properties": {
    //           "job_description": {
    //             "$ref": "#/components/schemas/JobDescriptionPayload"
    //           },
    //           "positions_count": {
    //             "type": "integer",
    //             "format": "int32"
    //           },
    //           "priority": {
    //             "type": "string",
    //             "minLength": 1,
    //             "pattern": "low|medium|high"
    //           },
    //           "target_hire_date": {
    //             "type": "string",
    //             "minLength": 1,
    //             "pattern": "\\d{4}-\\d{2}-\\d{2}"
    //           },
    //           "submitted_by": {
    //             "type": "string",
    //             "minLength": 1
    //           },
    //           "timezone": {
    //             "type": "string",
    //             "minLength": 1,
    //             "pattern": "[A-Za-z]+/[A-Za-z]+"
    //           },
    //           "validTimezone": {
    //             "type": "boolean"
    //           }
    //         },
    //         "required": [
    //           "job_description",
    //           "positions_count"
    //         ]
    //       },
    //       "JobRequisitionSubmissionResultAsResp": {
    //         "type": "object",
    //         "properties": {
    //           "requisition_id": {
    //             "type": "string"
    //           },
    //           "submitted_by": {
    //             "type": "string"
    //           },
    //           "submitted_at": {
    //             "type": "string"
    //           },
    //           "timezone": {
    //             "type": "string"
    //           },
    //           "message": {
    //             "type": "string"
    //           }
    //         }
    //       }
    //     }
    //   }
    // };

    const docs: any = { "openapi": "3.1.0", "info": { "title": "OpenAPI definition", "version": "v0" }, "servers": [{ "url": "http://172.30.10.21:8080", "description": "Generated server url" }], "paths": { "/api/services/{id}": { "put": { "tags": ["service-controller"], "operationId": "updateService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ServiceUpsertPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/release": { "put": { "tags": ["service-controller"], "operationId": "releaseService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/maintain": { "put": { "tags": ["service-controller"], "operationId": "maintainService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/logo/add": { "put": { "tags": ["service-controller"], "operationId": "addServiceLogo", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "requestBody": { "content": { "application/json": { "schema": { "type": "object", "properties": { "file": { "type": "string", "format": "binary" } }, "required": ["file"] } } } }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/draft-version": { "put": { "tags": ["service-controller"], "operationId": "draftNewVersion", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ServiceUpsertPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/documentation/add": { "put": { "tags": ["service-controller"], "operationId": "addServiceDocumentation", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "requestBody": { "content": { "application/json": { "schema": { "type": "object", "properties": { "file": { "type": "string", "format": "binary" } }, "required": ["file"] } } } }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/deprecate": { "put": { "tags": ["service-controller"], "operationId": "deprecateService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/categories/{category_id}/remove": { "put": { "tags": ["service-controller"], "operationId": "removeCategoryFromService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }, { "name": "category_id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/categories/{category_id}/add": { "put": { "tags": ["service-controller"], "operationId": "addCategoryToService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }, { "name": "category_id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/api-specification/add": { "put": { "tags": ["service-controller"], "operationId": "addServiceApiSpecification", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "requestBody": { "content": { "application/json": { "schema": { "type": "object", "properties": { "file": { "type": "string", "format": "binary" } }, "required": ["file"] } } } }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/{id}/activate": { "put": { "tags": ["service-controller"], "operationId": "activateService", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/create": { "post": { "tags": ["service-controller"], "operationId": "createService", "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ServiceUpsertPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/keycloak/verify-token": { "post": { "tags": ["keycloak-controller"], "operationId": "verifyToken", "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/AccessTokenPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "type": "object" } } } } } } }, "/api/keycloak/get-token": { "post": { "tags": ["keycloak-controller"], "operationId": "getToken", "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/AuthOptionsPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "type": "object" } } } } } } }, "/api/keycloak/get-refresh-token": { "post": { "tags": ["keycloak-controller"], "operationId": "getRefreshToken", "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/RefreshTokenPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "type": "object" } } } } } } }, "/api/categories/create": { "post": { "tags": ["category-controller"], "operationId": "createCategory", "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/CategoryUpsertPayload" } } }, "required": true }, "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderCategoryResponse" } } } } } } }, "/api/services/{id}/logo": { "get": { "tags": ["service-controller"], "operationId": "getServiceLogo", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "type": "object" } } } } } } }, "/api/services/{id}/documentation": { "get": { "tags": ["service-controller"], "operationId": "getServiceDocumentation", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "type": "object" } } } } } } }, "/api/services/{id}/api-specification": { "get": { "tags": ["service-controller"], "operationId": "getServiceApiSpecification", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "type": "object" } } } } } } }, "/api/services/slug/{slug}": { "get": { "tags": ["service-controller"], "operationId": "getServiceBySlug", "parameters": [{ "name": "slug", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceResponse" } } } } } } }, "/api/services/category/{category_id}": { "get": { "tags": ["service-controller"], "operationId": "getServiceByCategoryId", "parameters": [{ "name": "category_id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceListResponse" } } } } } } }, "/api/services/category/slug/{category_slug}": { "get": { "tags": ["service-controller"], "operationId": "getServiceByCategorySlug", "parameters": [{ "name": "category_slug", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceListResponse" } } } } } } }, "/api/services/all": { "get": { "tags": ["service-controller"], "operationId": "getAllServices", "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderServiceListResponse" } } } } } } }, "/api/categories/{id}": { "get": { "tags": ["category-controller"], "operationId": "getCategoryById", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderCategoryResponse" } } } } } } }, "/api/categories/slug/{slug}": { "get": { "tags": ["category-controller"], "operationId": "getCategoryBySlug", "parameters": [{ "name": "slug", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderCategoryResponse" } } } } } } }, "/api/categories/all": { "get": { "tags": ["category-controller"], "operationId": "getAllCategories", "responses": { "200": { "description": "OK", "content": { "*/*": { "schema": { "$ref": "#/components/schemas/ResponseWrapperResponseBuilderCategoryListResponse" } } } } } } } }, "components": { "schemas": { "ServiceUpsertPayload": { "type": "object", "properties": { "slug": { "type": "string" }, "name": { "type": "string" }, "description": { "type": "string" }, "service_base_url": { "type": "string" }, "semantic_version": { "type": "string" }, "is_featured": { "type": "boolean" } } }, "CategoryResponse": { "type": "object", "properties": { "id": { "type": "string" }, "slug": { "type": "string" }, "name": { "type": "string" } } }, "ErrorDetail": { "type": "object", "properties": { "field": { "type": "string" }, "issue": { "type": "string" } } }, "ResponseBuilderServiceResponse": { "type": "object", "properties": { "id": { "type": "string" }, "slug": { "type": "string" }, "name": { "type": "string" }, "description": { "type": "string" }, "logo_url": { "type": "string" }, "service_base_url": { "type": "string" }, "version": { "type": "string" }, "documentation_url": { "type": "string" }, "api_specification_url": { "type": "string" }, "is_released": { "type": "boolean" }, "released_at": { "type": "string" }, "status": { "type": "integer", "format": "int32" }, "completion_score": { "type": "number", "format": "float" }, "is_featured": { "type": "boolean" }, "categories": { "type": "array", "items": { "$ref": "#/components/schemas/CategoryResponse" } }, "created_at": { "type": "string" }, "modified_at": { "type": "string" }, "timestamp": { "type": "string" }, "error": { "type": "string" }, "code": { "type": "string" }, "message": { "type": "string" }, "path": { "type": "string" }, "details": { "type": "array", "items": { "$ref": "#/components/schemas/ErrorDetail" } } } }, "ResponseWrapperResponseBuilderServiceResponse": { "type": "object", "properties": { "success": { "type": "boolean" }, "payload": { "$ref": "#/components/schemas/ResponseBuilderServiceResponse" } } }, "ServiceResponse": { "type": "object", "properties": { "id": { "type": "string" }, "slug": { "type": "string" }, "name": { "type": "string" }, "description": { "type": "string" }, "logo_url": { "type": "string" }, "service_base_url": { "type": "string" }, "version": { "type": "string" }, "documentation_url": { "type": "string" }, "api_specification_url": { "type": "string" }, "is_released": { "type": "boolean" }, "released_at": { "type": "string" }, "status": { "type": "string" }, "completion_score": { "type": "number", "format": "float" }, "is_featured": { "type": "boolean" }, "categories": { "type": "array", "items": { "$ref": "#/components/schemas/CategoryResponse" } }, "created_at": { "type": "string" }, "modified_at": { "type": "string" } } }, "AccessTokenPayload": { "type": "object", "properties": { "access_token": { "type": "string" } } }, "AuthOptionsPayload": { "type": "object", "properties": { "grant_type": { "type": "string" }, "client_id": { "type": "string" }, "client_secret": { "type": "string" }, "username": { "type": "string" }, "password": { "type": "string" } } }, "RefreshTokenPayload": { "type": "object", "properties": { "refresh_token": { "type": "string" } } }, "CategoryUpsertPayload": { "type": "object", "properties": { "slug": { "type": "string" }, "name": { "type": "string" } } }, "ResponseBuilderCategoryResponse": { "type": "object", "properties": { "id": { "type": "string" }, "slug": { "type": "string" }, "name": { "type": "string" }, "timestamp": { "type": "string" }, "status": { "type": "integer", "format": "int32" }, "error": { "type": "string" }, "code": { "type": "string" }, "message": { "type": "string" }, "path": { "type": "string" }, "details": { "type": "array", "items": { "$ref": "#/components/schemas/ErrorDetail" } } } }, "ResponseWrapperResponseBuilderCategoryResponse": { "type": "object", "properties": { "success": { "type": "boolean" }, "payload": { "$ref": "#/components/schemas/ResponseBuilderCategoryResponse" } } }, "ResponseBuilderServiceListResponse": { "type": "object", "properties": { "services": { "type": "array", "items": { "$ref": "#/components/schemas/ServiceResponse" } }, "timestamp": { "type": "string" }, "status": { "type": "integer", "format": "int32" }, "error": { "type": "string" }, "code": { "type": "string" }, "message": { "type": "string" }, "path": { "type": "string" }, "details": { "type": "array", "items": { "$ref": "#/components/schemas/ErrorDetail" } } } }, "ResponseWrapperResponseBuilderServiceListResponse": { "type": "object", "properties": { "success": { "type": "boolean" }, "payload": { "$ref": "#/components/schemas/ResponseBuilderServiceListResponse" } } }, "ResponseBuilderCategoryListResponse": { "type": "object", "properties": { "categories": { "type": "array", "items": { "$ref": "#/components/schemas/CategoryResponse" } }, "timestamp": { "type": "string" }, "status": { "type": "integer", "format": "int32" }, "error": { "type": "string" }, "code": { "type": "string" }, "message": { "type": "string" }, "path": { "type": "string" }, "details": { "type": "array", "items": { "$ref": "#/components/schemas/ErrorDetail" } } } }, "ResponseWrapperResponseBuilderCategoryListResponse": { "type": "object", "properties": { "success": { "type": "boolean" }, "payload": { "$ref": "#/components/schemas/ResponseBuilderCategoryListResponse" } } } } } }

    // get paths
    const paths: any = Object.keys(docs.paths);
    let endpoints: any[] = [];

    // loop paths
    paths.forEach((endpoint: string) => {
      const details = docs.paths[endpoint];
      const methods: any = Object.keys(details);

      methods.forEach((method: any) => {
        endpoints.push({ ...details[method], link: endpoint, tag: details[method].tags[0], method: method.toUpperCase(), color: getColor(method.toUpperCase()), name: details[method].summary });
      })
    });

    // update endpoints
    endpoints = Array.from(Map.groupBy(endpoints, (endpoint) => endpoint.tag));

    // set components level
    const componentsLevel: collapsedType[] = endpoints.map((items: any) => ({ key: items[0], collapsed: false }));

    // set endpoints
    setEndpoints(endpoints);

    // get paths
    const componentsSchemas: any = Object.keys(docs.components.schemas);
    const schemas: any[] = [];

    // loop schemas
    componentsSchemas.forEach((schema: string) => {
      const details = docs.components.schemas[schema];

      // push schemas
      schemas.push({ ...details, name: schema });
    });

    // set components level
    componentsLevel.push({ key: "schema", collapsed: false });

    // set collapsed
    setCollapsed(componentsLevel);

    // set schemas
    setSchemas(schemas);
  }

  const loadOpenApiDoc = () => {
    if (endpoints && router.query.params && router.query.tag) {
      // get tag
      const tag = router.query.tag;

      // get operation id
      const operationId = router.query.params[1];

      // set operation id
      setApiOperationId(operationId);

      // get api document
      const apiDocument = endpoints.find((endpoint: any) => endpoint[0] == tag)[1].find((api: any) => api.operationId == operationId);

      console.log();

      // set parameters
      setParameters(apiDocument.parameters.map((param: any) => ({ name: param.name, value: param.example ?? "", type: "string" })));

      // set api doc
      setApiDoc(endpoints.find((endpoint: any) => endpoint[0] == tag)[1].find((api: any) => api.operationId == operationId));
    }
  }

  const onCollapsed = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    // get key
    const key = e.currentTarget.dataset.key;

    // copy items
    const collapsedItems = [...collapsed];

    // get index
    const index = collapsedItems.findIndex((item: collapsedType) => item.key == key);

    // if found
    if (index > -1) {
      // set state
      collapsedItems[index].collapsed = !collapsedItems[index].collapsed;
    }

    // set collapsed states
    setCollapsed(collapsedItems);
  }

  useEffect(() => {
    if (endpoints && router.query) {
      loadOpenApiDoc();
    }
  }, [endpoints, router.query]);

  useEffect(() => {
    loadOpenApiDocList();
  }, []);

  return (
    <>
      <div className="flex justify-between px-4">
        <div className="w-3/4 pe-4">
          {apiDoc && (
            <>
              <span className="flex items-center text-sm w-auto gap-2">
                <FolderOpen size={16} />
                <span className="block truncate font-semibold">{router.query.tag}</span>
                <ChevronRight size={16} />
                <span className="block truncate">{apiOperationId}</span>
              </span>

              <div className={twMerge("p-2 mt-3 flex items-center justify-between bg-white -border -border-black/10 -dark:border-white/10 rounded-md shadow w-auto")}>
                <div className="flex items-center gap-3">
                  <div className={twMerge("flex items-center bg-slate-700 text-sm font-semibold p-1.5 rounded-sm leading-normal text-white method-get/20", "icon-" + getColor(apiDoc.method))}>{apiDoc.method}</div>
                  <p className="text-sm">{apiDoc.link}</p>
                </div>
                <Button type="button" color="primary">Test API</Button>
              </div>

              <TabContent ulClassName="my-3 justify-start" containerClassName="p-0" tabs={[
                { name: "Parameters", icon: "BookText", link: `/services/${service.name}/api-docs/${apiOperationId}/parameters?tag=${router.query.tag}`, content: <Parameters data={parameters} /> },
                { name: "Request Body", icon: "Workflow", link: `/services/${service.name}/api-docs/${apiOperationId}/requestbody?tag=${router.query.tag}`, content: <h1>B</h1> },
                { name: "Headers", icon: "Trash2", link: `/services/${service.name}/api-docs/${apiOperationId}/headers?tag=${router.query.tag}`, content: <h1>C</h1> }
              ]} />
            </>
          )}
        </div>

        {/*  onClick={onApiClick} data-tag={tag} data-operation-id={item.operationId} */}
        <div className="w-1/4 ps-4 border-l border-black/10 dark:border-white/10">
          <div className="flex justify-stretch flex-col relative" style={{ height: "calc(100vh - 311px)" }}>
            <OverlayScrollbarsComponent className="" options={{ scrollbars: { autoHide: "leave", theme: (theme || session.theme) == "dark" ? "os-theme-light" : "os-theme-dark" } }}>
              <div className="flex flex-col gap-4">
                {endpoints && endpoints.map(([tag, apis]: any, index: number) => (
                  <React.Fragment key={index}>
                    <Link href="#" onClick={onCollapsed} data-key={tag} className="text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-white">
                      <Icon name={collapsed.find(item => item.key == tag)?.collapsed ? "FolderClosed" : "FolderOpen"} size={16} /><span>{tag} ({apis.length})</span>
                    </Link>
                    <div className={twMerge(variants({ collapsed: collapsed.find(item => item.key == tag)?.collapsed }))}>
                      {apis.map((item: any, i: number) => (
                        <div key={i} className="group">
                          <Link href={`/services/${service.name}/api-docs/${item.operationId}/parameters?tag=${tag}`} className={twMerge("text-xs w-full rounded-md flex items-center gap-1 h-8 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 py-1 ps-2", apiOperationId === item.operationId ? "bg-slate-200 dark:bg-slate-700" : "")}>
                            <span className={twMerge("flex text-xs size-12 font-semibold shrink-0 items-center justify-end", "text-" + getColor(item.method))}>
                              {item.method}
                            </span>
                            <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 me-2">
                              <span className="block truncate text-xs ms-2">{item.name || item.link}</span>
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                    {index <= endpoints.length - 2 && (
                      <div className="border-t border-black/10 dark:border-white/10"></div>
                    )}
                  </React.Fragment>
                ))}
                {schemas && schemas.length && (
                  <>
                    <div className="border-t border-black/10 dark:border-white/10"></div>
                    <Link href="#" onClick={onCollapsed} data-key="schema" className="text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-white">
                      <Icon name={collapsed.find(item => item.key == "schema")?.collapsed ? "FolderClosed" : "FolderOpen"} size={16} /><span>Schemas ({schemas.length})</span>
                    </Link>
                    <div className={twMerge(variants({ collapsed: collapsed.find(item => item.key == "schema")?.collapsed }))}>
                      {schemas.map((schema: any, i: number) => (
                        <React.Fragment key={i}>
                          <div key={i} className="group">
                            <Link href={`#`} className="text-xs w-full rounded-md flex items-center gap-1 h-8 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 py-1 ps-2">
                              <span className="flex text-xs size-12 font-semibold shrink-0 items-center justify-end">
                                <Box size={16} className="text-pink-500" />
                              </span>
                              <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 me-2">
                                <span className="block truncate text-xs ms-2">{schema.name}</span>
                              </span>
                            </Link>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </OverlayScrollbarsComponent>
          </div>
        </div>
      </div>
    </>
  )
}