import Image from "next/image";
import Link from "next/link";
import { SessionData } from "@/libs/session";
import { useState, useEffect, Dispatch } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalState } from "@/context/globalState";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";
import Tags, { TagsType } from '@/components/Tags';

import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { Settings, PanelLeftClose, PanelLeftOpen, Pin, Star } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { Apis, Api } from "@/libs/apis";
import React from "react";

export default function MainMenu({ session, service }: { session: SessionData, service: Api }) {
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
  const { isMainMenuOpen, saveMenuStateToSession, theme } = useGlobalState();
  const [apiTags, setApiTags] = useState<any>();
  // const [endpoints, setEndpoints] = useState<any>();

  const getColor = (method: string) => {
    let color: string;

    switch (method) {
      case "GET":
        color = "text-green-400";
        break;
      case "POST":
        color = "text-yellow-400";
        break;
      case "PUT":
        color = "text-blue-400";
        break;
      case "PATCH":
        color = "text-violet-400";
        break;
      case "DELETE":
        color = "text-red-400";
        break;
      case "HEAD":
        color = "text-primary-400";
        break;
      case "OPTIONS":
        color = "text-pink-400";
        break;
      default:
        color = "text-green-400";
    }

    return color;
  }

  const handleLogout = async (e: any) => {
    e.preventDefault();

    // activate page progress
    showProgress(true);

    // call api
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // get response data
    const data = await response.json();

    // pause
    setTimeout(() => {
      // activate page progress
      showProgress(false);

      // redirect to login
      router.push("/login");

      // pause
      setTimeout(() => {
        // show message
        addToast(data.message, MessageTypes.Success, 1500);
      }, 500);
    }, 500);
  };

  // const loadApiDocs = () => {
  //   const docs: any = {
  //     "openapi": "3.1.0",
  //     "info": {
  //       "title": "Job Requisition Module API",
  //       "description": "Job Requisition Module of Somnetics Automated HR Recruitment Application",
  //       "version": "<version>"
  //     },
  //     "servers": [
  //       {
  //         "url": "http://localhost:5001",
  //         "description": "Generated server url"
  //       }
  //     ],
  //     "paths": {
  //       "/api/v1/requisitions/{id}/update-state": {
  //         "put": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "operationId": "updateJobRequisitionState",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "minLength": 1,
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               }
  //             }
  //           ],
  //           "requestBody": {
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/JobRequisitionStateUpdatePayloadAsReq"
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "OK",
  //               "content": {
  //                 "*/*": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ResponseWrapperResponseBuilderJobRequisitionStateUpdateResultAsResp"
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions/{id}/recommend-candidates": {
  //         "put": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Recommend candidates for a job requisition",
  //           "description": "Attaches sample candidate profiles to a job requisition for testing and demonstration purposes",
  //           "operationId": "recommendCandidates",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "description": "UUID of the job requisition",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "379aa447-9557-42c1-856e-26f32f7da56c"
  //             }
  //           ],
  //           "responses": {
  //             "200": {
  //               "description": "Candidates successfully recommended and attached",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                       "status": "pending",
  //                       "candidate_profiles": [
  //                         {
  //                           "candidate_id": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                           "state": "pending"
  //                         }
  //                       ],
  //                       "message": "Candidates successfully recommended and attached to the requisition."
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 404,
  //                       "error": "Not Found",
  //                       "code": "JOB_REQUISITION_NOT_FOUND",
  //                       "message": "Job requisition with ID '379aa447-9557-42c1-856e-26f32f7da56c' was not found.",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/recommend-candidates",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/recommend-candidates",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions/{id}/propose-budget": {
  //         "put": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Propose budget for a job requisition",
  //           "description": "Updates a job requisition with budget limit and changes state to BUDGET_PROPOSED",
  //           "operationId": "proposeBudgetToRequisition",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "description": "UUID of the job requisition",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "2252e74f-edcc-4112-bed4-966dbc3d922c"
  //             }
  //           ],
  //           "requestBody": {
  //             "description": "Budget proposal payload",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/JobRequisitionBudgetProposalPayloadAsAReq"
  //                 },
  //                 "example": {
  //                   "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                   "task_name": "budget_proposal",
  //                   "budget_limit": 50000
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "Budget proposal successfully submitted",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/JobRequisitionBudgetProposalResultAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                       "budget_limit": 50000,
  //                       "submitted_by": "finance.manager@company.com",
  //                       "submitted_at": "2025-07-15 14:49:39",
  //                       "timezone": "Asia/Kolkata",
  //                       "message": "Budget proposal successfully submitted."
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "400": {
  //               "description": "Bad Request",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions/{id}/candidates/{candidateId}": {
  //         "get": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Get candidate profile for a job requisition",
  //           "description": "Retrieves the profile of a specific candidate associated with a job requisition",
  //           "operationId": "getCandidateProfile",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "description": "UUID of the job requisition",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "379aa447-9557-42c1-856e-26f32f7da56c"
  //             },
  //             {
  //               "name": "candidateId",
  //               "in": "path",
  //               "description": "UUID of the candidate",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df"
  //             }
  //           ],
  //           "responses": {
  //             "200": {
  //               "description": "Candidate profile successfully retrieved",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "candidate_id": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "status": "recommended"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "400": {
  //               "description": "Bad Request",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 400,
  //                       "error": "Bad Request",
  //                       "code": "VALIDATION_FAILURE",
  //                       "message": "Validation failed.",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "details": [
  //                         {
  //                           "field": "requisitionId",
  //                           "issue": "Requisition ID must not be blank."
  //                         }
  //                       ],
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 404,
  //                       "error": "Not Found",
  //                       "code": "CANDIDATE_PROFILE_NOT_FOUND",
  //                       "message": "Candidate profile with ID '7d767e93-7a61-4a5b-8cc6-dc2c0601f3df' was not found in requisition '379aa447-9557-42c1-856e-26f32f7da56c'.",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         },
  //         "put": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Update candidate profile for a job requisition",
  //           "description": "Updates the profile of a specific candidate associated with a job requisition",
  //           "operationId": "updateCandidateProfile",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "description": "UUID of the job requisition",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "379aa447-9557-42c1-856e-26f32f7da56c"
  //             },
  //             {
  //               "name": "candidateId",
  //               "in": "path",
  //               "description": "UUID of the candidate",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df"
  //             }
  //           ],
  //           "requestBody": {
  //             "description": "Candidate profile update payload",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/CandidateProfileUpdatePayloadAsReq"
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "Candidate profile successfully updated",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
  //                   }
  //                 }
  //               }
  //             },
  //             "400": {
  //               "description": "Bad Request",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 400,
  //                       "error": "Bad Request",
  //                       "code": "VALIDATION_FAILURE",
  //                       "message": "Validation failed.",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "details": [
  //                         {
  //                           "field": "requisitionId",
  //                           "issue": "Requisition ID must not be blank."
  //                         }
  //                       ],
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 404,
  //                       "error": "Not Found",
  //                       "code": "CANDIDATE_PROFILE_NOT_FOUND",
  //                       "message": "Candidate profile with ID '7d767e93-7a61-4a5b-8cc6-dc2c0601f3df' was not found in requisition '379aa447-9557-42c1-856e-26f32f7da56c'.",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions/{id}/candidates/shortlist": {
  //         "put": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Shortlist candidate profiles",
  //           "description": "Shortlist candidate profiles associated to a job requisition",
  //           "operationId": "shortlistCandidateProfiles",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "description": "UUID of the job requisition",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "2252e74f-edcc-4112-bed4-966dbc3d922c"
  //             }
  //           ],
  //           "requestBody": {
  //             "description": "Candidate Profiles Shortlisting payload",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/CandidateProfilesShortlistingPayloadAsReq"
  //                 },
  //                 "example": {
  //                   "candidate_profiles": [
  //                     {
  //                       "id": "6c5008d1-f247-429a-b6b2-5473ec5eb652",
  //                       "action": "Shortlist"
  //                     },
  //                     {
  //                       "id": "732c564b-97df-453b-aa30-079bcd4de794",
  //                       "action": "Shortlist"
  //                     }
  //                   ]
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "Candidate profiles shortlisted successfully",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/CandidateProfilesShortlistingResultAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "requisition_id": "2252e74f-edcc-4112-bed4-966dbc3d922c",
  //                       "fulfillment_id": "eea2a63e-3a2b-4486-9d28-e39412f219ce",
  //                       "message": "Candidate profiles shortlisted successfully."
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "400": {
  //               "description": "Bad Request",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 400,
  //                       "error": "Bad Request",
  //                       "code": "JOB_REQUISITION_NOT_YET_APPROVED",
  //                       "message": "Job requisition with ID 'e80ee3de-4398-4473-9a78-95a6d3faf885' has not been approved yet.",
  //                       "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-95a6d3faf885/candidates/shortlist",
  //                       "timestamp": "2025-07-24T05:12:53.801552044Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 404,
  //                       "error": "Not Found",
  //                       "code": "JOB_REQUISITION_NOT_FOUND",
  //                       "message": "Job requisition with ID 'e80ee3de-4398-4473-9a78-94a6d3faf885' was not found.",
  //                       "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-94a6d3faf885/candidates/shortlist",
  //                       "timestamp": "2025-07-24T05:13:54.546687260Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-94a6d3faf885/candidates/shortlist",
  //                       "timestamp": "2025-07-24T05:13:54.546687260Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions/{id}/attach-fulfillment": {
  //         "put": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "operationId": "attachFulfillment",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "minLength": 1,
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               }
  //             }
  //           ],
  //           "requestBody": {
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/JobRequisitionFulfillmentAttachmentPayloadAsReq"
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "OK",
  //               "content": {
  //                 "*/*": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ResponseWrapperResponseBuilderJobRequisitionFulfillmentAttachmentResultAsResp"
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/workflow/terminate": {
  //         "post": {
  //           "tags": [
  //             "workflow-controller-impl"
  //           ],
  //           "summary": "Terminate an active workflow process",
  //           "description": "Forcefully terminates a running workflow instance identified by tenant and correlation ID.",
  //           "operationId": "terminateWorkflow",
  //           "requestBody": {
  //             "description": "Payload identifying the workflow process to terminate",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/WorkflowTerminationClientPayloadAsReq"
  //                 },
  //                 "example": {
  //                   "tenant_id": "tenant-001",
  //                   "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c"
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "Workflow successfully terminated",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/MessageAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "message": "Workflow termination successful"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "Workflow termination failed",
  //                       "path": "/api/v1/workflow/terminate",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/workflow/initiate": {
  //         "post": {
  //           "tags": [
  //             "workflow-controller-impl"
  //           ],
  //           "summary": "Initiate a new workflow process",
  //           "description": "Starts a new workflow instance in the BPMN engine based on the provided process details.",
  //           "operationId": "initiateWorkflow",
  //           "parameters": [
  //             {
  //               "name": "Authorization",
  //               "in": "header",
  //               "required": false,
  //               "schema": {
  //                 "type": "string"
  //               }
  //             }
  //           ],
  //           "requestBody": {
  //             "description": "Workflow initiation payload containing process and tenant details",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/ProcessInstanceInitiationClientPayloadAsReq"
  //                 },
  //                 "example": {
  //                   "tenant_id": "tenant-001",
  //                   "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                   "bpmn_process_id": "job_requisition_process",
  //                   "bpmn_process_version": 2,
  //                   "variables": {
  //                     "requisitionId": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                     "priority": "high"
  //                   }
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "Workflow process successfully initiated",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/MessageAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "message": "Process initiation successful"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "Process initiation failed",
  //                       "path": "/api/v1/workflow/initiate",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/workflow/complete-user-task": {
  //         "post": {
  //           "tags": [
  //             "workflow-controller-impl"
  //           ],
  //           "summary": "Complete a user task in an active workflow",
  //           "description": "Marks a specific user task as completed and optionally updates process variables.",
  //           "operationId": "completeUserTask",
  //           "parameters": [
  //             {
  //               "name": "Authorization",
  //               "in": "header",
  //               "required": false,
  //               "schema": {
  //                 "type": "string"
  //               }
  //             }
  //           ],
  //           "requestBody": {
  //             "description": "Payload containing user task details for completion",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/UserTaskCompletionClientPayloadAsReq"
  //                 },
  //                 "example": {
  //                   "tenant_id": "tenant-001",
  //                   "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                   "task_definition_id": "approve_job_requisition",
  //                   "task_assignee": "manager@company.com",
  //                   "variables": {
  //                     "requisitionId": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                     "approvalStatus": "approved"
  //                   }
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "200": {
  //               "description": "User task successfully completed",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/MessageAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "message": "User Task completion successful"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "User Task completion failed",
  //                       "path": "/api/v1/workflow/complete-user-task",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions": {
  //         "get": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Retrieve all job requisitions",
  //           "description": "Returns a list of all job requisitions based on parameters",
  //           "operationId": "getAllJobRequisitions",
  //           "parameters": [
  //             {
  //               "name": "status",
  //               "in": "query",
  //               "description": "Status of the job requisition",
  //               "required": false,
  //               "schema": {
  //                 "type": "string",
  //                 "enum": [
  //                   "pending",
  //                   "rejected",
  //                   "approved",
  //                   "processing"
  //                 ]
  //               }
  //             },
  //             {
  //               "name": "skip",
  //               "in": "query",
  //               "description": "Skip N job requisitions from top",
  //               "required": false,
  //               "schema": {
  //                 "type": "integer",
  //                 "default": 0
  //               }
  //             },
  //             {
  //               "name": "limit",
  //               "in": "query",
  //               "description": "Limit number of requisitions to retrieve",
  //               "required": false,
  //               "schema": {
  //                 "type": "integer",
  //                 "default": 100
  //               }
  //             },
  //             {
  //               "name": "page",
  //               "in": "query",
  //               "description": "Zero-based page index (0..N)",
  //               "schema": {
  //                 "type": "integer",
  //                 "default": 0
  //               }
  //             },
  //             {
  //               "name": "size",
  //               "in": "query",
  //               "description": "The size of the page to be returned",
  //               "schema": {
  //                 "type": "integer",
  //                 "default": 10
  //               }
  //             }
  //           ],
  //           "responses": {
  //             "200": {
  //               "description": "All job requisitions successfully retrieved",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "content": [
  //                         {
  //                           "requisition_id": "6b0178f9-95ef-4f5f-94b0-88f33e9105c2",
  //                           "status": "pending",
  //                           "job_description": {
  //                             "title": "Software Engineer",
  //                             "description": "Develop and maintain Java-based backend systems.",
  //                             "department": "Engineering",
  //                             "location": "Bangalore",
  //                             "experience_required": 3,
  //                             "skills_required": "Java, Spring Boot, MySQL",
  //                             "qualifications_required": "B.Tech in Computer Science"
  //                           },
  //                           "positions_count": 2,
  //                           "priority": "high",
  //                           "target_hire_date": "2025-06-01 00:00:00",
  //                           "submitted_by": "anita.singh@company.com",
  //                           "submitted_at": "2025-07-22 19:19:51",
  //                           "timezone": "Asia/Kolkata"
  //                         },
  //                         {
  //                           "requisition_id": "dea25ba4-4d9c-4d53-bfeb-7bd721a547f3",
  //                           "status": "pending",
  //                           "job_description": {
  //                             "title": "Software Engineer",
  //                             "description": "Develop and maintain Java-based backend systems.",
  //                             "department": "Engineering",
  //                             "location": "Bangalore",
  //                             "experience_required": 3,
  //                             "skills_required": "Java, Spring Boot, MySQL",
  //                             "qualifications_required": "B.Tech in Computer Science"
  //                           },
  //                           "positions_count": 2,
  //                           "priority": "high",
  //                           "target_hire_date": "2025-06-01 00:00:00",
  //                           "submitted_by": "anita.singh@company.com",
  //                           "submitted_at": "2025-07-21 18:21:40",
  //                           "timezone": "Asia/Kolkata"
  //                         }
  //                       ],
  //                       "number_of_elements": 2,
  //                       "total_elements": 2,
  //                       "total_pages": 1,
  //                       "page_size": 10,
  //                       "page_number": 0,
  //                       "offset": 0,
  //                       "sorted": false,
  //                       "first": true,
  //                       "last": true,
  //                       "empty": false
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 404,
  //                       "error": "Not Found",
  //                       "code": "JOB_REQUISITION_NOT_FOUND",
  //                       "message": "No job requisitions were found.",
  //                       "path": "/api/v1/requisitions",
  //                       "timestamp": "2025-07-23T09:11:37.209218174Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions",
  //                       "timestamp": "2025-07-23T09:12:56.760253721Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         },
  //         "post": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Create a new job requisition",
  //           "description": "Adds a new job requisition with the provided details",
  //           "operationId": "submitJobRequisition",
  //           "parameters": [
  //             {
  //               "name": "Authorization",
  //               "in": "header",
  //               "required": false,
  //               "schema": {
  //                 "type": "string"
  //               }
  //             }
  //           ],
  //           "requestBody": {
  //             "description": "Job requisition creation payload",
  //             "content": {
  //               "application/json": {
  //                 "schema": {
  //                   "$ref": "#/components/schemas/JobRequisitionSubmissionPayloadAsReq"
  //                 },
  //                 "example": {
  //                   "job_description": {
  //                     "title": "Software Engineer",
  //                     "description": "Develop and maintain Java-based backend systems.",
  //                     "department": "Engineering",
  //                     "location": "Bangalore",
  //                     "experience_required": 3,
  //                     "skills_required": "Java, Spring Boot, MySQL",
  //                     "qualifications_required": "B.Tech in Computer Science"
  //                   },
  //                   "positions_count": 2,
  //                   "target_hire_date": "2025-06-01",
  //                   "priority": "high",
  //                   "submitted_by": "anita.singh@company.com",
  //                   "submitted_at": "2025-05-13 12:05:36",
  //                   "timezone": "Asia/Kolkata"
  //                 }
  //               }
  //             },
  //             "required": true
  //           },
  //           "responses": {
  //             "201": {
  //               "description": "Job requisition successfully submitted",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/JobRequisitionSubmissionResultAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
  //                       "submitted_by": "anita.singh@company.com",
  //                       "submitted_at": "2025-07-15 14:49:39",
  //                       "timezone": "Asia/Kolkata",
  //                       "message": "Job requisition successfully submitted."
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "400": {
  //               "description": "Bad Request",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 400,
  //                       "error": "Bad Request",
  //                       "code": "VALIDATION_FAILURE",
  //                       "message": "Validation failed.",
  //                       "path": "/api/v1/requisitions",
  //                       "details": [
  //                         {
  //                           "field": "job_description.title",
  //                           "issue": "Title must not be blank."
  //                         },
  //                         {
  //                           "field": "positions_count",
  //                           "issue": "Positions count must not be null."
  //                         }
  //                       ],
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions",
  //                       "timestamp": "2025-07-15T09:24:45.141764613Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/requisitions/{id}": {
  //         "get": {
  //           "tags": [
  //             "job-requisition-controller-impl"
  //           ],
  //           "summary": "Retrieve a job requisition by ID",
  //           "description": "Returns a specific job requisition based on the provided ID",
  //           "operationId": "getJobRequisitionById",
  //           "parameters": [
  //             {
  //               "name": "id",
  //               "in": "path",
  //               "description": "UUID of the job requisition",
  //               "required": true,
  //               "schema": {
  //                 "type": "string",
  //                 "format": "uuid",
  //                 "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  //               },
  //               "example": "dea25ba4-4d9c-4d53-bfeb-7bd821a547f3"
  //             }
  //           ],
  //           "responses": {
  //             "200": {
  //               "description": "Job requisition successfully retieved",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
  //                   },
  //                   "example": {
  //                     "success": true,
  //                     "payload": {
  //                       "requisition_id": "dea25ba4-4d9c-4d53-bfeb-7bd721a547f3",
  //                       "status": "pending",
  //                       "job_description": {
  //                         "title": "Software Engineer",
  //                         "description": "Develop and maintain Java-based backend systems.",
  //                         "department": "Engineering",
  //                         "location": "Bangalore",
  //                         "experience_required": 3,
  //                         "skills_required": "Java, Spring Boot, MySQL",
  //                         "qualifications_required": "B.Tech in Computer Science"
  //                       },
  //                       "positions_count": 2,
  //                       "priority": "high",
  //                       "target_hire_date": "2025-06-01 00:00:00",
  //                       "submitted_by": "anita.singh@company.com",
  //                       "submitted_at": "2025-07-21 18:21:40",
  //                       "timezone": "Asia/Kolkata"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "404": {
  //               "description": "Not Found",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 404,
  //                       "error": "Not Found",
  //                       "code": "JOB_REQUISITION_NOT_FOUND",
  //                       "message": "Job requisition with ID 'dea25ba4-4d9c-4d53-bfeb-7bd821a547f3' was not found.",
  //                       "path": "/api/v1/requisitions/dea25ba4-4d9c-4d53-bfeb-7bd821a547f3",
  //                       "timestamp": "2025-07-23T07:30:55.661277606Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             "500": {
  //               "description": "Internal System Error",
  //               "content": {
  //                 "application/json": {
  //                   "schema": {
  //                     "$ref": "#/components/schemas/ErrorResponse"
  //                   },
  //                   "example": {
  //                     "success": false,
  //                     "payload": {
  //                       "status": 500,
  //                       "error": "Internal Server Error",
  //                       "code": "INTERNAL_SYSTEM_FAILURE",
  //                       "message": "<FAILURE_MESSAGE>",
  //                       "path": "/api/v1/requisitions/dea25ba4-4d9c-4d53-bfeb-7bd821a547f3",
  //                       "timestamp": "2025-07-23T07:38:33.520324497Z"
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/authentication/userinfo": {
  //         "get": {
  //           "tags": [
  //             "authentication-controller"
  //           ],
  //           "operationId": "getUserInfo",
  //           "parameters": [
  //             {
  //               "name": "Access-Token",
  //               "in": "header",
  //               "required": true,
  //               "schema": {
  //                 "type": "string"
  //               }
  //             }
  //           ],
  //           "responses": {
  //             "200": {
  //               "description": "OK",
  //               "content": {
  //                 "*/*": {
  //                   "schema": {
  //                     "type": "object"
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/authentication/token": {
  //         "get": {
  //           "tags": [
  //             "authentication-controller"
  //           ],
  //           "operationId": "exchangeCode",
  //           "parameters": [
  //             {
  //               "name": "code",
  //               "in": "query",
  //               "required": true,
  //               "schema": {
  //                 "type": "string"
  //               }
  //             }
  //           ],
  //           "responses": {
  //             "200": {
  //               "description": "OK",
  //               "content": {
  //                 "*/*": {
  //                   "schema": {
  //                     "type": "object"
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       "/api/v1/authentication/auth-url": {
  //         "get": {
  //           "tags": [
  //             "authentication-controller"
  //           ],
  //           "operationId": "getAuthUrl",
  //           "responses": {
  //             "200": {
  //               "description": "OK",
  //               "content": {
  //                 "*/*": {
  //                   "schema": {
  //                     "type": "object"
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };

  //   // get paths
  //   let paths: any = Object.keys(docs.paths);
  //   let apis: any[] = [];

  //   // loop paths
  //   paths.forEach((endpoint: string) => {
  //     const details = docs.paths[endpoint];
  //     const methods: any = Object.keys(details);

  //     methods.forEach((method: any) => {
  //       apis.push({ ...details[method], link: endpoint, tag: details[method].tags[0], method: method.toUpperCase(), color: getColor(method.toUpperCase()), name: details[method].summary });
  //     })
  //   });

  //   // set endpoints
  //   // setEndpoints(apis);

  //   // get tags
  //   setApiTags(Array.from(Map.groupBy(apis, (api) => api.tag)));
  // }

  const loadOpenApiDocs = () => {
    const docs: any = {
      "openapi": "3.1.0",
      "info": {
        "title": "Rising India News Generation API",
        "description": "An API to create curated news along with image generation and translation.",
        "version": "1.0.0"
      },
      "paths": {
        "/api/token": {
          "post": {
            "tags": [
              "Authentication",
              "Authentication"
            ],
            "summary": "Login For Access Token",
            "operationId": "login_for_access_token_api_token_post",
            "requestBody": {
              "content": {
                "application/x-www-form-urlencoded": {
                  "schema": {
                    "$ref": "#/components/schemas/Body_login_for_access_token_api_token_post"
                  }
                }
              },
              "required": true
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/refresh": {
          "post": {
            "tags": [
              "Authentication",
              "Authentication"
            ],
            "summary": "Refresh Token",
            "operationId": "refresh_token_api_refresh_post",
            "parameters": [
              {
                "name": "refresh_token",
                "in": "cookie",
                "required": true,
                "schema": {
                  "type": "string",
                  "title": "Refresh Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/logout": {
          "post": {
            "tags": [
              "Authentication",
              "Authentication"
            ],
            "summary": "Logout",
            "description": "Logs out the user by clearing the access and refresh tokens from cookies.",
            "operationId": "logout_api_logout_post",
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                    }
                  }
                }
              }
            }
          }
        },
        "/api/users/": {
          "post": {
            "tags": [
              "Users"
            ],
            "summary": "Create User",
            "description": "Create a new user.",
            "operationId": "create_user_api_users__post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserCreate"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "get": {
            "tags": [
              "Users"
            ],
            "summary": "Read Users",
            "description": "Retrieve all users.\n\n- **role**: admin",
            "operationId": "read_users_api_users__get",
            "parameters": [
              {
                "name": "skip",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 0,
                  "title": "Skip"
                }
              },
              {
                "name": "limit",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 100,
                  "title": "Limit"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/User"
                      },
                      "title": "Response Read Users Api Users  Get"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/users/me": {
          "get": {
            "tags": [
              "Users"
            ],
            "summary": "Read Current User",
            "description": "Get current user.",
            "operationId": "read_current_user_api_users_me_get",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "put": {
            "tags": [
              "Users"
            ],
            "summary": "Update Current User",
            "description": "Update own user data.",
            "operationId": "update_current_user_api_users_me_put",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserUpdate"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/users/me/roles": {
          "get": {
            "tags": [
              "Users"
            ],
            "summary": "Read Current User Roles",
            "description": "Get the roles of the current user.",
            "operationId": "read_current_user_roles_api_users_me_roles_get",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/RoleType"
                      },
                      "title": "Response Read Current User Roles Api Users Me Roles Get"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/users/{user_id}": {
          "get": {
            "tags": [
              "Users"
            ],
            "summary": "Read User",
            "description": "Get a specific user by their ID.\n\n- **role**: admin",
            "operationId": "read_user_api_users__user_id__get",
            "parameters": [
              {
                "name": "user_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "User Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "put": {
            "tags": [
              "Users"
            ],
            "summary": "Update User",
            "description": "Update a user's details.\n\n- **role**: admin",
            "operationId": "update_user_api_users__user_id__put",
            "parameters": [
              {
                "name": "user_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "User Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserUpdate"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "delete": {
            "tags": [
              "Users"
            ],
            "summary": "Delete User",
            "description": "Delete a user.\n\n- **role**: admin",
            "operationId": "delete_user_api_users__user_id__delete",
            "parameters": [
              {
                "name": "user_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "User Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/users/{user_id}/roles": {
          "post": {
            "tags": [
              "Users"
            ],
            "summary": "Assign Roles To User",
            "description": "Assign roles to a user, replacing any existing roles.\n\n- **role**: admin",
            "operationId": "assign_roles_to_user_api_users__user_id__roles_post",
            "parameters": [
              {
                "name": "user_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "User Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserRoleAssign"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/users/me/language-preferences": {
          "get": {
            "tags": [
              "Users"
            ],
            "summary": "Get My Language Preferences",
            "description": "Get the language preferences for the current user.",
            "operationId": "get_my_language_preferences_api_users_me_language_preferences_get",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "title": "Response Get My Language Preferences Api Users Me Language Preferences Get"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "put": {
            "tags": [
              "Users"
            ],
            "summary": "Set My Language Preferences",
            "description": "Set the language preferences for the current user.",
            "operationId": "set_my_language_preferences_api_users_me_language_preferences_put",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "title": "Languages"
                  }
                }
              }
            },
            "responses": {
              "204": {
                "description": "Successful Response"
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/articles/": {
          "post": {
            "tags": [
              "Articles"
            ],
            "summary": "Create Article",
            "description": "Create a new article. Only accessible by users with the 'curator' role.\nThe author of the article is automatically set to the current authenticated user.\nOn successful creation of article, the **parent article ID** is returned.\n\n- **role**: curator",
            "operationId": "create_article_api_articles__post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleCreate"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Article"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/articles/{article_id}": {
          "get": {
            "tags": [
              "Articles"
            ],
            "summary": "Read Article Details",
            "description": "Get a specific article by its ID, including all its translations.",
            "operationId": "read_article_details_api_articles__article_id__get",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Article"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "delete": {
            "tags": [
              "Articles"
            ],
            "summary": "Delete Article",
            "description": "Delete an article by its parent article ID.\nAll subsequent entries of the translations and publishing information is removed.\n\n- **role**: admin",
            "operationId": "delete_article_api_articles__article_id__delete",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Article"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/articles/{article_id}/image": {
          "patch": {
            "tags": [
              "Articles"
            ],
            "summary": "Update Article Image",
            "description": "Update an article's image. Before updating the image, it should be uploaded using the `/api/upload-image/` route.\n\n- **role**: curator",
            "operationId": "update_article_image_api_articles__article_id__image_patch",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Body_update_article_image_api_articles__article_id__image_patch"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Article"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/articles/{article_id}/translations": {
          "post": {
            "tags": [
              "Articles"
            ],
            "summary": "Create Article Translation",
            "description": "Add a Bengali or Hindi translation to an existing article.\n\n- **role**: curator",
            "operationId": "create_article_translation_api_articles__article_id__translations_post",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleContentCreate"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ArticleContent"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/articles/{article_id}/translations/{language}": {
          "get": {
            "tags": [
              "Articles"
            ],
            "summary": "Read Article Translation",
            "description": "Get a specific translation (bengali or hindi) for an article.",
            "operationId": "read_article_translation_api_articles__article_id__translations__language__get",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "language",
                "in": "path",
                "required": true,
                "schema": {
                  "enum": [
                    "bengali",
                    "hindi"
                  ],
                  "type": "string",
                  "title": "Language"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ArticleContentWithImage"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          },
          "delete": {
            "tags": [
              "Articles"
            ],
            "summary": "Delete Article Translation",
            "description": "Delete a specific translation for an article.\n\n- **role**: curator",
            "operationId": "delete_article_translation_api_articles__article_id__translations__language__delete",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "language",
                "in": "path",
                "required": true,
                "schema": {
                  "$ref": "#/components/schemas/Language"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ArticleContent"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/articles/revisions": {
          "post": {
            "tags": [
              "Articles"
            ],
            "summary": "Create Article Revision",
            "description": "Create a new revision for an article. Only accessible by users with the 'proofreader' role.\n\n- **role**: proofreader",
            "operationId": "create_article_revision_api_articles_revisions_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RevisionCreate"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Revision"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/proofreader/queue": {
          "get": {
            "tags": [
              "Publishing"
            ],
            "summary": "Get Proofreading Queue",
            "description": "Retrieves the proofreading queue for the current proofreader.",
            "operationId": "get_proofreading_queue_api_proofreader_queue_get",
            "parameters": [
              {
                "name": "language",
                "in": "query",
                "required": true,
                "schema": {
                  "enum": [
                    "bengali",
                    "hindi"
                  ],
                  "type": "string",
                  "title": "Language"
                }
              },
              {
                "name": "status",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "$ref": "#/components/schemas/PublishingStatus"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Status"
                }
              },
              {
                "name": "search",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "integer"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Search"
                }
              },
              {
                "name": "skip",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 0,
                  "title": "Skip"
                }
              },
              {
                "name": "limit",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 100,
                  "title": "Limit"
                }
              },
              {
                "name": "sort_by_date",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "string",
                  "default": "newest",
                  "title": "Sort By Date"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/PublishingQueueRead"
                      },
                      "title": "Response Get Proofreading Queue Api Proofreader Queue Get"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/proofreader/articles": {
          "get": {
            "tags": [
              "Publishing"
            ],
            "summary": "Get Proofreader Articles",
            "description": "Retrieves all articles assigned to the current proofreader.",
            "operationId": "get_proofreader_articles_api_proofreader_articles_get",
            "parameters": [
              {
                "name": "language",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Language"
                }
              },
              {
                "name": "status",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "$ref": "#/components/schemas/PublishingStatus"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Status"
                }
              },
              {
                "name": "search",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "integer"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Search"
                }
              },
              {
                "name": "order",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "string",
                  "default": "newest",
                  "title": "Order"
                }
              },
              {
                "name": "skip",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 0,
                  "title": "Skip"
                }
              },
              {
                "name": "limit",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 10,
                  "title": "Limit"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/PublishingArticleRead"
                      },
                      "title": "Response Get Proofreader Articles Api Proofreader Articles Get"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/proofreader/assign/{article_id}": {
          "post": {
            "tags": [
              "Publishing"
            ],
            "summary": "Assign Article To Proofreader",
            "description": "Assigns an article to the current proofreader.",
            "operationId": "assign_article_to_proofreader_api_proofreader_assign__article_id__post",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Publishing"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/curator/create-entry": {
          "post": {
            "tags": [
              "Publishing"
            ],
            "summary": "Create Publishing Entry Route",
            "description": "Creates a publishing entry for an article.",
            "operationId": "create_publishing_entry_route_api_curator_create_entry_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PublishingEntryCreate"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Publishing"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/proofreader/articles/{article_id}/status": {
          "put": {
            "tags": [
              "Publishing"
            ],
            "summary": "Update Article Status Route",
            "description": "Updates the status of an article by the assigned proofreader.",
            "operationId": "update_article_status_route_api_proofreader_articles__article_id__status_put",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleStatusUpdate"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Publishing"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/proofreader/articles/{article_id}/reject": {
          "put": {
            "tags": [
              "Publishing"
            ],
            "summary": "Reject Article Route",
            "description": "Rejects an article by the assigned proofreader.",
            "operationId": "reject_article_route_api_proofreader_articles__article_id__reject_put",
            "parameters": [
              {
                "name": "article_id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleReject"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Publishing"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/curator/history": {
          "get": {
            "tags": [
              "Publishing"
            ],
            "summary": "Get Curator History",
            "description": "Retrieves the history of articles for the current curator.",
            "operationId": "get_curator_history_api_curator_history_get",
            "parameters": [
              {
                "name": "language",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Language"
                }
              },
              {
                "name": "status",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "$ref": "#/components/schemas/PublishingStatus"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Status"
                }
              },
              {
                "name": "search",
                "in": "query",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "integer"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Search"
                }
              },
              {
                "name": "order",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "string",
                  "default": "newest",
                  "title": "Order"
                }
              },
              {
                "name": "skip",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 0,
                  "title": "Skip"
                }
              },
              {
                "name": "limit",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer",
                  "default": 10,
                  "title": "Limit"
                }
              },
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/CuratorHistory"
                      },
                      "title": "Response Get Curator History Api Curator History Get"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/publish-translation": {
          "post": {
            "tags": [
              "Publishing"
            ],
            "summary": "Publish Translation",
            "operationId": "publish_translation_api_publish_translation_post",
            "parameters": [
              {
                "name": "article_id",
                "in": "query",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/PublishArticleResponseSchema"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/publish-english-news": {
          "post": {
            "tags": [
              "Publishing"
            ],
            "summary": "Publish English News",
            "operationId": "publish_english_news_api_publish_english_news_post",
            "parameters": [
              {
                "name": "article_id",
                "in": "query",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/PublishArticleResponseSchema"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/get-english-content": {
          "get": {
            "tags": [
              "Publishing"
            ],
            "summary": "Get English Content",
            "operationId": "get_english_content_api_get_english_content_get",
            "parameters": [
              {
                "name": "article_id",
                "in": "query",
                "required": true,
                "schema": {
                  "type": "integer",
                  "title": "Article Id"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ArticleContent"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/search-news": {
          "post": {
            "tags": [
              "News Sourcing"
            ],
            "summary": "Search News",
            "operationId": "search_news_api_search_news_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/NewsSourcingRequest"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/NewsSourcingResponse"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/search-web": {
          "post": {
            "tags": [
              "Web Search"
            ],
            "summary": "Search",
            "operationId": "search_api_search_web_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/NewsSourcingRequest"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/FetchedNewsArticle"
                      },
                      "title": "Response Search Api Search Web Post"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/curate": {
          "post": {
            "tags": [
              "Curation"
            ],
            "summary": "Get Curated News",
            "operationId": "get_curated_news_api_curate_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CurationRequestSchema"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/CuratedNewsArticle"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/translate": {
          "post": {
            "tags": [
              "Translation"
            ],
            "summary": "Translate Text",
            "operationId": "translate_text_api_translate_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TranslationRequestSchema"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/TranslationResponseSchema"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/translate-news": {
          "post": {
            "tags": [
              "Translation"
            ],
            "summary": "Translate News Article",
            "operationId": "translate_news_article_api_translate_news_post",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TranslationArticleRequestSchema"
                  }
                }
              },
              "required": true
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/TranslationArticleResponseSchema"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/translate-news-gemini": {
          "post": {
            "tags": [
              "Translation"
            ],
            "summary": "Translate News Article Gemini",
            "operationId": "translate_news_article_gemini_api_translate_news_gemini_post",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TranslationArticleRequestSchema"
                  }
                }
              },
              "required": true
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/TranslationArticleResponseSchema"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/generate-image": {
          "post": {
            "tags": [
              "Image Generation"
            ],
            "summary": "Generate Image",
            "operationId": "generate_image_api_generate_image_post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ImageGenerationRequest"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ImageGenerationResponse"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        },
        "/api/upload-image/": {
          "post": {
            "tags": [
              "Image Upload"
            ],
            "summary": "Upload Image",
            "description": "Uploads an image, saves it with a unique filename, and returns the filename as an ID.\n\n- **role**: curator",
            "operationId": "upload_image_api_upload_image__post",
            "parameters": [
              {
                "name": "access_token",
                "in": "cookie",
                "required": false,
                "schema": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Access Token"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "multipart/form-data": {
                  "schema": {
                    "$ref": "#/components/schemas/Body_upload_image_api_upload_image__post"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful Response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ImageUploadResponseSchema"
                    }
                  }
                }
              },
              "422": {
                "description": "Validation Error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/HTTPValidationError"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "Article": {
            "properties": {
              "sources": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Sources"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "author_id": {
                "type": "integer",
                "title": "Author Id"
              },
              "created_at": {
                "type": "string",
                "format": "date-time",
                "title": "Created At"
              },
              "contents": {
                "items": {
                  "$ref": "#/components/schemas/ArticleContent"
                },
                "type": "array",
                "title": "Contents",
                "default": [

                ]
              }
            },
            "type": "object",
            "required": [
              "id",
              "author_id",
              "created_at"
            ],
            "title": "Article"
          },
          "ArticleContent": {
            "properties": {
              "language": {
                "type": "string",
                "enum": [
                  "english",
                  "bengali",
                  "hindi"
                ],
                "title": "Language"
              },
              "content": {
                "title": "Content"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "article_id": {
                "type": "integer",
                "title": "Article Id"
              },
              "revision": {
                "type": "boolean",
                "title": "Revision"
              }
            },
            "type": "object",
            "required": [
              "language",
              "content",
              "id",
              "article_id",
              "revision"
            ],
            "title": "ArticleContent"
          },
          "ArticleContentCreate": {
            "properties": {
              "language": {
                "type": "string",
                "enum": [
                  "english",
                  "bengali",
                  "hindi"
                ],
                "title": "Language"
              },
              "content": {
                "title": "Content"
              }
            },
            "type": "object",
            "required": [
              "language",
              "content"
            ],
            "title": "ArticleContentCreate"
          },
          "ArticleContentWithImage": {
            "properties": {
              "language": {
                "type": "string",
                "enum": [
                  "english",
                  "bengali",
                  "hindi"
                ],
                "title": "Language"
              },
              "content": {
                "title": "Content"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "article_id": {
                "type": "integer",
                "title": "Article Id"
              },
              "revision": {
                "type": "boolean",
                "title": "Revision"
              },
              "image_data": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Image Data"
              }
            },
            "type": "object",
            "required": [
              "language",
              "content",
              "id",
              "article_id",
              "revision"
            ],
            "title": "ArticleContentWithImage"
          },
          "ArticleCreate": {
            "properties": {
              "sources": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Sources"
              },
              "content": {
                "title": "Content"
              },
              "language": {
                "type": "string",
                "title": "Language"
              }
            },
            "type": "object",
            "required": [
              "content",
              "language"
            ],
            "title": "ArticleCreate"
          },
          "ArticleReject": {
            "properties": {
              "remarks": {
                "type": "string",
                "title": "Remarks"
              }
            },
            "type": "object",
            "required": [
              "remarks"
            ],
            "title": "ArticleReject"
          },
          "ArticleStatusUpdate": {
            "properties": {
              "status": {
                "$ref": "#/components/schemas/PublishingStatus"
              }
            },
            "type": "object",
            "required": [
              "status"
            ],
            "title": "ArticleStatusUpdate"
          },
          "Body_login_for_access_token_api_token_post": {
            "properties": {
              "grant_type": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^password$"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Grant Type"
              },
              "username": {
                "type": "string",
                "title": "Username"
              },
              "password": {
                "type": "string",
                "format": "password",
                "title": "Password"
              },
              "scope": {
                "type": "string",
                "title": "Scope",
                "default": ""
              },
              "client_id": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Client Id"
              },
              "client_secret": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "format": "password",
                "title": "Client Secret"
              }
            },
            "type": "object",
            "required": [
              "username",
              "password"
            ],
            "title": "Body_login_for_access_token_api_token_post"
          },
          "Body_update_article_image_api_articles__article_id__image_patch": {
            "properties": {
              "image_uuid": {
                "type": "string",
                "title": "Image Uuid"
              }
            },
            "type": "object",
            "required": [
              "image_uuid"
            ],
            "title": "Body_update_article_image_api_articles__article_id__image_patch"
          },
          "Body_upload_image_api_upload_image__post": {
            "properties": {
              "file": {
                "type": "string",
                "format": "binary",
                "title": "File"
              }
            },
            "type": "object",
            "required": [
              "file"
            ],
            "title": "Body_upload_image_api_upload_image__post"
          },
          "CuratedNewsArticle": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "introduction": {
                "type": "string",
                "title": "Introduction"
              },
              "body": {
                "items": {
                  "$ref": "#/components/schemas/CuratedNewsSection"
                },
                "type": "array",
                "title": "Body"
              },
              "summary": {
                "type": "string",
                "title": "Summary"
              }
            },
            "type": "object",
            "required": [
              "title",
              "introduction",
              "body",
              "summary"
            ],
            "title": "CuratedNewsArticle"
          },
          "CuratedNewsSection": {
            "properties": {
              "heading": {
                "type": "string",
                "title": "Heading"
              },
              "body": {
                "type": "string",
                "title": "Body"
              }
            },
            "type": "object",
            "required": [
              "heading",
              "body"
            ],
            "title": "CuratedNewsSection"
          },
          "CurationRequestSchema": {
            "properties": {
              "news_reports": {
                "items": {
                  "type": "string"
                },
                "type": "array",
                "title": "News Reports"
              }
            },
            "type": "object",
            "required": [
              "news_reports"
            ],
            "title": "CurationRequestSchema"
          },
          "CuratorHistory": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "article_content_id": {
                "type": "integer",
                "title": "Article Content Id"
              },
              "status": {
                "$ref": "#/components/schemas/PublishingStatus"
              },
              "remarks": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Remarks"
              },
              "date": {
                "type": "string",
                "format": "date-time",
                "title": "Date"
              },
              "content": {
                "title": "Content"
              },
              "language": {
                "type": "string",
                "title": "Language"
              }
            },
            "type": "object",
            "required": [
              "title",
              "article_content_id",
              "status",
              "date",
              "content",
              "language"
            ],
            "title": "CuratorHistory"
          },
          "FetchedNewsArticle": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "content": {
                "type": "string",
                "title": "Content"
              },
              "publisher": {
                "type": "string",
                "title": "Publisher"
              },
              "link": {
                "type": "string",
                "title": "Link"
              }
            },
            "type": "object",
            "required": [
              "title",
              "content",
              "publisher",
              "link"
            ],
            "title": "FetchedNewsArticle"
          },
          "HTTPValidationError": {
            "properties": {
              "detail": {
                "items": {
                  "$ref": "#/components/schemas/ValidationError"
                },
                "type": "array",
                "title": "Detail"
              }
            },
            "type": "object",
            "title": "HTTPValidationError"
          },
          "ImageGenerationRequest": {
            "properties": {
              "news_content": {
                "type": "string",
                "title": "News Content"
              }
            },
            "type": "object",
            "required": [
              "news_content"
            ],
            "title": "ImageGenerationRequest"
          },
          "ImageGenerationResponse": {
            "properties": {
              "base64_image": {
                "type": "string",
                "title": "Base64 Image"
              }
            },
            "type": "object",
            "required": [
              "base64_image"
            ],
            "title": "ImageGenerationResponse"
          },
          "ImageUploadResponseSchema": {
            "properties": {
              "uuid": {
                "type": "string",
                "title": "Uuid"
              }
            },
            "type": "object",
            "required": [
              "uuid"
            ],
            "title": "ImageUploadResponseSchema"
          },
          "Language": {
            "type": "string",
            "enum": [
              "english",
              "bengali",
              "hindi"
            ],
            "title": "Language"
          },
          "NewsSourcingRequest": {
            "properties": {
              "query": {
                "type": "string",
                "title": "Query"
              }
            },
            "type": "object",
            "required": [
              "query"
            ],
            "title": "NewsSourcingRequest"
          },
          "NewsSourcingResponse": {
            "properties": {
              "articles": {
                "items": {
                  "$ref": "#/components/schemas/FetchedNewsArticle"
                },
                "type": "array",
                "title": "Articles"
              }
            },
            "type": "object",
            "required": [
              "articles"
            ],
            "title": "NewsSourcingResponse"
          },
          "PublishArticleResponseSchema": {
            "properties": {
              "message": {
                "type": "string",
                "title": "Message"
              }
            },
            "type": "object",
            "required": [
              "message"
            ],
            "title": "PublishArticleResponseSchema"
          },
          "Publishing": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "language": {
                "type": "string",
                "title": "Language"
              },
              "status": {
                "$ref": "#/components/schemas/PublishingStatus"
              },
              "category": {
                "type": "string",
                "title": "Category"
              },
              "type": {
                "type": "string",
                "title": "Type"
              },
              "heading": {
                "type": "string",
                "title": "Heading"
              },
              "tagline": {
                "type": "string",
                "title": "Tagline"
              },
              "region": {
                "type": "string",
                "title": "Region"
              },
              "remarks": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Remarks"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "curator_id": {
                "type": "integer",
                "title": "Curator Id"
              },
              "proofreader_id": {
                "anyOf": [
                  {
                    "type": "integer"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Proofreader Id"
              },
              "article_content_id": {
                "type": "integer",
                "title": "Article Content Id"
              }
            },
            "type": "object",
            "required": [
              "title",
              "language",
              "status",
              "category",
              "type",
              "heading",
              "tagline",
              "region",
              "id",
              "curator_id",
              "article_content_id"
            ],
            "title": "Publishing"
          },
          "PublishingArticleRead": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "language": {
                "type": "string",
                "title": "Language"
              },
              "status": {
                "$ref": "#/components/schemas/PublishingStatus"
              },
              "category": {
                "type": "string",
                "title": "Category"
              },
              "type": {
                "type": "string",
                "title": "Type"
              },
              "heading": {
                "type": "string",
                "title": "Heading"
              },
              "tagline": {
                "type": "string",
                "title": "Tagline"
              },
              "region": {
                "type": "string",
                "title": "Region"
              },
              "remarks": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Remarks"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "curator_id": {
                "type": "integer",
                "title": "Curator Id"
              },
              "proofreader_id": {
                "anyOf": [
                  {
                    "type": "integer"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Proofreader Id"
              },
              "article_content_id": {
                "type": "integer",
                "title": "Article Content Id"
              },
              "published_at": {
                "type": "string",
                "format": "date-time",
                "title": "Published At"
              }
            },
            "type": "object",
            "required": [
              "title",
              "language",
              "status",
              "category",
              "type",
              "heading",
              "tagline",
              "region",
              "id",
              "curator_id",
              "article_content_id",
              "published_at"
            ],
            "title": "PublishingArticleRead"
          },
          "PublishingEntryCreate": {
            "properties": {
              "article_id": {
                "type": "integer",
                "title": "Article Id"
              },
              "title": {
                "type": "string",
                "title": "Title"
              },
              "language": {
                "type": "string",
                "title": "Language"
              },
              "category": {
                "type": "string",
                "title": "Category"
              },
              "type": {
                "type": "string",
                "title": "Type"
              },
              "heading": {
                "type": "string",
                "title": "Heading"
              },
              "tagline": {
                "type": "string",
                "title": "Tagline"
              },
              "region": {
                "type": "string",
                "title": "Region"
              }
            },
            "type": "object",
            "required": [
              "article_id",
              "title",
              "language",
              "category",
              "type",
              "heading",
              "tagline",
              "region"
            ],
            "title": "PublishingEntryCreate"
          },
          "PublishingQueueRead": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "language": {
                "type": "string",
                "title": "Language"
              },
              "status": {
                "$ref": "#/components/schemas/PublishingStatus"
              },
              "category": {
                "type": "string",
                "title": "Category"
              },
              "type": {
                "type": "string",
                "title": "Type"
              },
              "heading": {
                "type": "string",
                "title": "Heading"
              },
              "tagline": {
                "type": "string",
                "title": "Tagline"
              },
              "region": {
                "type": "string",
                "title": "Region"
              },
              "remarks": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Remarks"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "curator_id": {
                "type": "integer",
                "title": "Curator Id"
              },
              "proofreader_id": {
                "anyOf": [
                  {
                    "type": "integer"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Proofreader Id"
              },
              "article_content_id": {
                "type": "integer",
                "title": "Article Content Id"
              },
              "created_at": {
                "type": "string",
                "format": "date-time",
                "title": "Created At"
              }
            },
            "type": "object",
            "required": [
              "title",
              "language",
              "status",
              "category",
              "type",
              "heading",
              "tagline",
              "region",
              "id",
              "curator_id",
              "article_content_id",
              "created_at"
            ],
            "title": "PublishingQueueRead"
          },
          "PublishingStatus": {
            "type": "string",
            "enum": [
              "pending",
              "processing",
              "published",
              "rejected"
            ],
            "title": "PublishingStatus"
          },
          "Revision": {
            "properties": {
              "article_content_id": {
                "type": "integer",
                "title": "Article Content Id"
              },
              "modified_article": {
                "title": "Modified Article"
              },
              "id": {
                "type": "integer",
                "title": "Id"
              },
              "created_at": {
                "type": "string",
                "format": "date-time",
                "title": "Created At"
              }
            },
            "type": "object",
            "required": [
              "article_content_id",
              "modified_article",
              "id",
              "created_at"
            ],
            "title": "Revision"
          },
          "RevisionCreate": {
            "properties": {
              "article_content_id": {
                "type": "integer",
                "title": "Article Content Id"
              },
              "modified_article": {
                "title": "Modified Article"
              }
            },
            "type": "object",
            "required": [
              "article_content_id",
              "modified_article"
            ],
            "title": "RevisionCreate"
          },
          "Role": {
            "properties": {
              "role": {
                "$ref": "#/components/schemas/RoleType"
              },
              "rid": {
                "type": "integer",
                "title": "Rid"
              },
              "uid": {
                "type": "integer",
                "title": "Uid"
              }
            },
            "type": "object",
            "required": [
              "role",
              "rid",
              "uid"
            ],
            "title": "Role"
          },
          "RoleType": {
            "type": "string",
            "enum": [
              "admin",
              "curator",
              "proofreader"
            ],
            "title": "RoleType"
          },
          "TranslationArticleRequestSchema": {
            "properties": {
              "language": {
                "type": "string",
                "enum": [
                  "Bengali",
                  "Hindi"
                ],
                "title": "Language"
              },
              "article": {
                "$ref": "#/components/schemas/CuratedNewsArticle"
              }
            },
            "type": "object",
            "required": [
              "language",
              "article"
            ],
            "title": "TranslationArticleRequestSchema"
          },
          "TranslationArticleResponseSchema": {
            "properties": {
              "title": {
                "type": "string",
                "title": "Title"
              },
              "body": {
                "type": "string",
                "title": "Body"
              }
            },
            "type": "object",
            "required": [
              "title",
              "body"
            ],
            "title": "TranslationArticleResponseSchema"
          },
          "TranslationRequestSchema": {
            "properties": {
              "language": {
                "type": "string",
                "enum": [
                  "Bengali",
                  "Hindi"
                ],
                "title": "Language"
              },
              "text": {
                "type": "string",
                "title": "Text"
              }
            },
            "type": "object",
            "required": [
              "language",
              "text"
            ],
            "title": "TranslationRequestSchema"
          },
          "TranslationResponseSchema": {
            "properties": {
              "translated_text": {
                "type": "string",
                "title": "Translated Text"
              }
            },
            "type": "object",
            "required": [
              "translated_text"
            ],
            "title": "TranslationResponseSchema"
          },
          "User": {
            "properties": {
              "email": {
                "type": "string",
                "format": "email",
                "title": "Email"
              },
              "full_name": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Full Name"
              },
              "uid": {
                "type": "integer",
                "title": "Uid"
              },
              "roles": {
                "items": {
                  "$ref": "#/components/schemas/Role"
                },
                "type": "array",
                "title": "Roles",
                "default": [

                ]
              }
            },
            "type": "object",
            "required": [
              "email",
              "uid"
            ],
            "title": "User"
          },
          "UserCreate": {
            "properties": {
              "email": {
                "type": "string",
                "format": "email",
                "title": "Email"
              },
              "full_name": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Full Name"
              },
              "password": {
                "type": "string",
                "title": "Password"
              },
              "roles": {
                "items": {
                  "$ref": "#/components/schemas/RoleType"
                },
                "type": "array",
                "title": "Roles",
                "default": [

                ]
              }
            },
            "type": "object",
            "required": [
              "email",
              "password"
            ],
            "title": "UserCreate"
          },
          "UserRoleAssign": {
            "properties": {
              "roles": {
                "items": {
                  "$ref": "#/components/schemas/RoleType"
                },
                "type": "array",
                "title": "Roles"
              }
            },
            "type": "object",
            "required": [
              "roles"
            ],
            "title": "UserRoleAssign"
          },
          "UserUpdate": {
            "properties": {
              "email": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "email"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Email"
              },
              "full_name": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Full Name"
              },
              "password": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "title": "Password"
              }
            },
            "type": "object",
            "title": "UserUpdate"
          },
          "ValidationError": {
            "properties": {
              "loc": {
                "items": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "integer"
                    }
                  ]
                },
                "type": "array",
                "title": "Location"
              },
              "msg": {
                "type": "string",
                "title": "Message"
              },
              "type": {
                "type": "string",
                "title": "Error Type"
              }
            },
            "type": "object",
            "required": [
              "loc",
              "msg",
              "type"
            ],
            "title": "ValidationError"
          }
        }
      }
    };

    // get paths
    let paths: any = Object.keys(docs.paths);
    let apis: any[] = [];

    // loop paths
    paths.forEach((endpoint: string) => {
      const details = docs.paths[endpoint];
      const methods: any = Object.keys(details);

      methods.forEach((method: any) => {
        apis.push({ ...details[method], link: endpoint, tag: details[method].tags[0], method: method.toUpperCase(), color: getColor(method.toUpperCase()), name: details[method].summary });
      })
    });

    // set endpoints
    // setEndpoints(apis);

    // get tags
    setApiTags(Array.from(Map.groupBy(apis, (api) => api.tag)));
  }

  useEffect(() => {
    loadOpenApiDocs();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between 1max-w-9xl mx-auto p-4 mb-4">
        <div className="prose dark:prose-invert prose-h1:font-bold prose-h1:text-[28px] prose-a:text-blue-600 prose-p:text-justify prose-img:rounded-xl -prose-headings:underline">
          {/* <Preview source={source} theme={session.theme} /> */}
          {/* <div className="p-4">
            <span className="font-semibold text-sm w-auto">{apiDetails.name || apiDetails.link}</span>
            <div className="p-2 mt-4 flex items-center border border-gray-700 rounded-md w-auto space-x-2">
              <div className={twMerge("flex items-center bg-gray-700 text-sm font-semibold p-2 rounded", apiDetails.color)}>
                <span>{apiDetails.method}</span>
              </div>
              <Textbox type="text" esize="sm" rounded="sm" className="py-1" defaultValue={apiDetails.link} />
              <Button type="button" color="primary">Test</Button>
            </div>
          </div> */}
        </div>
        <div className="lg:w-1/4 mt-16 lg:mt-0 border-l border-black/10 dark:border-white/10 pl-6">
          <div className="sticky top-[130px]">
            <div className="flex flex-col">
              {apiTags && apiTags.map(([tag, endpoints]: any, index: number) => (
                <React.Fragment key={index}>
                  <p className={twMerge("text-xs font-semibold mb-3")}><span>{tag}</span> ({endpoints.length})</p>
                  <div className="flex flex-col gap-1">
                    {endpoints.map((item: any, i: number) => (
                      <div key={i} className="group">
                        <Link href={`/service/${service.name}/apidocumentation/${item.operationId}/params`} className={"text-xs w-full rounded-lg flex items-center gap-1 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1 ps-2 " + (pathname.startsWith(item.link) && item.link.length > 1 || item.link == pathname ? "bg-gray-200 dark:bg-gray-700" : "")}>
                          <span className={twMerge("flex text-xs size-12 font-semibold shrink-0 items-center justify-end", getColor(item.method))}>
                            {item.method}
                          </span>
                          <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 me-2">
                            <span className="block truncate sm:hidden lg:block text-xs ms-2">{item.name || item.link}</span>
                          </span>
                        </Link>
                      </div>
                    ))}
                    {index <= apiTags.length - 2 && (
                      <div className="mb-[15px] mt-4 border-t border-black/10 dark:border-white/10"></div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}