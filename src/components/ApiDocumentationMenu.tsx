import Image from "next/image";
import Link from "next/link";
import { SessionData } from "@/libs/session";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalState } from "@/context/globalState";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";

import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { Settings, PanelLeftClose, PanelLeftOpen, Pin, Star } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { Apis, Api } from "@/libs/apis";

export default function MainMenu({ session }: { session: SessionData }) {
  const router = useRouter();
  const pathname = usePathname();

  const docs: any = {
    "openapi": "3.1.0",
    "info": {
      "title": "Job Requisition Module API",
      "description": "Job Requisition Module of Somnetics Automated HR Recruitment Application",
      "version": "<version>"
    },
    "servers": [
      {
        "url": "http://localhost:5001",
        "description": "Generated server url"
      }
    ],
    "paths": {
      "/api/v1/requisitions/{id}/update-state": {
        "put": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "operationId": "updateJobRequisitionState",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string",
                "minLength": 1,
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/JobRequisitionStateUpdatePayloadAsReq"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "*/*": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseWrapperResponseBuilderJobRequisitionStateUpdateResultAsResp"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions/{id}/recommend-candidates": {
        "put": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Recommend candidates for a job requisition",
          "description": "Attaches sample candidate profiles to a job requisition for testing and demonstration purposes",
          "operationId": "recommendCandidates",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "UUID of the job requisition",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "379aa447-9557-42c1-856e-26f32f7da56c"
            }
          ],
          "responses": {
            "200": {
              "description": "Candidates successfully recommended and attached",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
                      "status": "pending",
                      "candidate_profiles": [
                        {
                          "candidate_id": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                          "state": "pending"
                        }
                      ],
                      "message": "Candidates successfully recommended and attached to the requisition."
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 404,
                      "error": "Not Found",
                      "code": "JOB_REQUISITION_NOT_FOUND",
                      "message": "Job requisition with ID '379aa447-9557-42c1-856e-26f32f7da56c' was not found.",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/recommend-candidates",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/recommend-candidates",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions/{id}/propose-budget": {
        "put": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Propose budget for a job requisition",
          "description": "Updates a job requisition with budget limit and changes state to BUDGET_PROPOSED",
          "operationId": "proposeBudgetToRequisition",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "UUID of the job requisition",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "2252e74f-edcc-4112-bed4-966dbc3d922c"
            }
          ],
          "requestBody": {
            "description": "Budget proposal payload",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/JobRequisitionBudgetProposalPayloadAsAReq"
                },
                "example": {
                  "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
                  "task_name": "budget_proposal",
                  "budget_limit": 50000
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Budget proposal successfully submitted",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/JobRequisitionBudgetProposalResultAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
                      "budget_limit": 50000,
                      "submitted_by": "finance.manager@company.com",
                      "submitted_at": "2025-07-15 14:49:39",
                      "timezone": "Asia/Kolkata",
                      "message": "Budget proposal successfully submitted."
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions/{id}/candidates/{candidateId}": {
        "get": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Get candidate profile for a job requisition",
          "description": "Retrieves the profile of a specific candidate associated with a job requisition",
          "operationId": "getCandidateProfile",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "UUID of the job requisition",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "379aa447-9557-42c1-856e-26f32f7da56c"
            },
            {
              "name": "candidateId",
              "in": "path",
              "description": "UUID of the candidate",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df"
            }
          ],
          "responses": {
            "200": {
              "description": "Candidate profile successfully retrieved",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "candidate_id": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "status": "recommended"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 400,
                      "error": "Bad Request",
                      "code": "VALIDATION_FAILURE",
                      "message": "Validation failed.",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "details": [
                        {
                          "field": "requisitionId",
                          "issue": "Requisition ID must not be blank."
                        }
                      ],
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 404,
                      "error": "Not Found",
                      "code": "CANDIDATE_PROFILE_NOT_FOUND",
                      "message": "Candidate profile with ID '7d767e93-7a61-4a5b-8cc6-dc2c0601f3df' was not found in requisition '379aa447-9557-42c1-856e-26f32f7da56c'.",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        },
        "put": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Update candidate profile for a job requisition",
          "description": "Updates the profile of a specific candidate associated with a job requisition",
          "operationId": "updateCandidateProfile",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "UUID of the job requisition",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "379aa447-9557-42c1-856e-26f32f7da56c"
            },
            {
              "name": "candidateId",
              "in": "path",
              "description": "UUID of the candidate",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "7d767e93-7a61-4a5b-8cc6-dc2c0601f3df"
            }
          ],
          "requestBody": {
            "description": "Candidate profile update payload",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CandidateProfileUpdatePayloadAsReq"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Candidate profile successfully updated",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CandidateProfileMetadataAsResp"
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 400,
                      "error": "Bad Request",
                      "code": "VALIDATION_FAILURE",
                      "message": "Validation failed.",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "details": [
                        {
                          "field": "requisitionId",
                          "issue": "Requisition ID must not be blank."
                        }
                      ],
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 404,
                      "error": "Not Found",
                      "code": "CANDIDATE_PROFILE_NOT_FOUND",
                      "message": "Candidate profile with ID '7d767e93-7a61-4a5b-8cc6-dc2c0601f3df' was not found in requisition '379aa447-9557-42c1-856e-26f32f7da56c'.",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions/379aa447-9557-42c1-856e-26f32f7da56c/candidates/7d767e93-7a61-4a5b-8cc6-dc2c0601f3df",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions/{id}/candidates/shortlist": {
        "put": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Shortlist candidate profiles",
          "description": "Shortlist candidate profiles associated to a job requisition",
          "operationId": "shortlistCandidateProfiles",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "UUID of the job requisition",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "2252e74f-edcc-4112-bed4-966dbc3d922c"
            }
          ],
          "requestBody": {
            "description": "Candidate Profiles Shortlisting payload",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CandidateProfilesShortlistingPayloadAsReq"
                },
                "example": {
                  "candidate_profiles": [
                    {
                      "id": "6c5008d1-f247-429a-b6b2-5473ec5eb652",
                      "action": "Shortlist"
                    },
                    {
                      "id": "732c564b-97df-453b-aa30-079bcd4de794",
                      "action": "Shortlist"
                    }
                  ]
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Candidate profiles shortlisted successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CandidateProfilesShortlistingResultAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "requisition_id": "2252e74f-edcc-4112-bed4-966dbc3d922c",
                      "fulfillment_id": "eea2a63e-3a2b-4486-9d28-e39412f219ce",
                      "message": "Candidate profiles shortlisted successfully."
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 400,
                      "error": "Bad Request",
                      "code": "JOB_REQUISITION_NOT_YET_APPROVED",
                      "message": "Job requisition with ID 'e80ee3de-4398-4473-9a78-95a6d3faf885' has not been approved yet.",
                      "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-95a6d3faf885/candidates/shortlist",
                      "timestamp": "2025-07-24T05:12:53.801552044Z"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 404,
                      "error": "Not Found",
                      "code": "JOB_REQUISITION_NOT_FOUND",
                      "message": "Job requisition with ID 'e80ee3de-4398-4473-9a78-94a6d3faf885' was not found.",
                      "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-94a6d3faf885/candidates/shortlist",
                      "timestamp": "2025-07-24T05:13:54.546687260Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions/e80ee3de-4398-4473-9a78-94a6d3faf885/candidates/shortlist",
                      "timestamp": "2025-07-24T05:13:54.546687260Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions/{id}/attach-fulfillment": {
        "put": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "operationId": "attachFulfillment",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string",
                "minLength": 1,
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/JobRequisitionFulfillmentAttachmentPayloadAsReq"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "*/*": {
                  "schema": {
                    "$ref": "#/components/schemas/ResponseWrapperResponseBuilderJobRequisitionFulfillmentAttachmentResultAsResp"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/workflow/terminate": {
        "post": {
          "tags": [
            "workflow-controller-impl"
          ],
          "summary": "Terminate an active workflow process",
          "description": "Forcefully terminates a running workflow instance identified by tenant and correlation ID.",
          "operationId": "terminateWorkflow",
          "requestBody": {
            "description": "Payload identifying the workflow process to terminate",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WorkflowTerminationClientPayloadAsReq"
                },
                "example": {
                  "tenant_id": "tenant-001",
                  "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Workflow successfully terminated",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "message": "Workflow termination successful"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "Workflow termination failed",
                      "path": "/api/v1/workflow/terminate",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/workflow/initiate": {
        "post": {
          "tags": [
            "workflow-controller-impl"
          ],
          "summary": "Initiate a new workflow process",
          "description": "Starts a new workflow instance in the BPMN engine based on the provided process details.",
          "operationId": "initiateWorkflow",
          "parameters": [
            {
              "name": "Authorization",
              "in": "header",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Workflow initiation payload containing process and tenant details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProcessInstanceInitiationClientPayloadAsReq"
                },
                "example": {
                  "tenant_id": "tenant-001",
                  "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c",
                  "bpmn_process_id": "job_requisition_process",
                  "bpmn_process_version": 2,
                  "variables": {
                    "requisitionId": "379aa447-9557-42c1-856e-26f32f7da56c",
                    "priority": "high"
                  }
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Workflow process successfully initiated",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "message": "Process initiation successful"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "Process initiation failed",
                      "path": "/api/v1/workflow/initiate",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/workflow/complete-user-task": {
        "post": {
          "tags": [
            "workflow-controller-impl"
          ],
          "summary": "Complete a user task in an active workflow",
          "description": "Marks a specific user task as completed and optionally updates process variables.",
          "operationId": "completeUserTask",
          "parameters": [
            {
              "name": "Authorization",
              "in": "header",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Payload containing user task details for completion",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserTaskCompletionClientPayloadAsReq"
                },
                "example": {
                  "tenant_id": "tenant-001",
                  "correlation_id": "379aa447-9557-42c1-856e-26f32f7da56c",
                  "task_definition_id": "approve_job_requisition",
                  "task_assignee": "manager@company.com",
                  "variables": {
                    "requisitionId": "379aa447-9557-42c1-856e-26f32f7da56c",
                    "approvalStatus": "approved"
                  }
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "User task successfully completed",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "message": "User Task completion successful"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "User Task completion failed",
                      "path": "/api/v1/workflow/complete-user-task",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions": {
        "get": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Retrieve all job requisitions",
          "description": "Returns a list of all job requisitions based on parameters",
          "operationId": "getAllJobRequisitions",
          "parameters": [
            {
              "name": "status",
              "in": "query",
              "description": "Status of the job requisition",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "pending",
                  "rejected",
                  "approved",
                  "processing"
                ]
              }
            },
            {
              "name": "skip",
              "in": "query",
              "description": "Skip N job requisitions from top",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 0
              }
            },
            {
              "name": "limit",
              "in": "query",
              "description": "Limit number of requisitions to retrieve",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 100
              }
            },
            {
              "name": "page",
              "in": "query",
              "description": "Zero-based page index (0..N)",
              "schema": {
                "type": "integer",
                "default": 0
              }
            },
            {
              "name": "size",
              "in": "query",
              "description": "The size of the page to be returned",
              "schema": {
                "type": "integer",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "All job requisitions successfully retrieved",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "content": [
                        {
                          "requisition_id": "6b0178f9-95ef-4f5f-94b0-88f33e9105c2",
                          "status": "pending",
                          "job_description": {
                            "title": "Software Engineer",
                            "description": "Develop and maintain Java-based backend systems.",
                            "department": "Engineering",
                            "location": "Bangalore",
                            "experience_required": 3,
                            "skills_required": "Java, Spring Boot, MySQL",
                            "qualifications_required": "B.Tech in Computer Science"
                          },
                          "positions_count": 2,
                          "priority": "high",
                          "target_hire_date": "2025-06-01 00:00:00",
                          "submitted_by": "anita.singh@company.com",
                          "submitted_at": "2025-07-22 19:19:51",
                          "timezone": "Asia/Kolkata"
                        },
                        {
                          "requisition_id": "dea25ba4-4d9c-4d53-bfeb-7bd721a547f3",
                          "status": "pending",
                          "job_description": {
                            "title": "Software Engineer",
                            "description": "Develop and maintain Java-based backend systems.",
                            "department": "Engineering",
                            "location": "Bangalore",
                            "experience_required": 3,
                            "skills_required": "Java, Spring Boot, MySQL",
                            "qualifications_required": "B.Tech in Computer Science"
                          },
                          "positions_count": 2,
                          "priority": "high",
                          "target_hire_date": "2025-06-01 00:00:00",
                          "submitted_by": "anita.singh@company.com",
                          "submitted_at": "2025-07-21 18:21:40",
                          "timezone": "Asia/Kolkata"
                        }
                      ],
                      "number_of_elements": 2,
                      "total_elements": 2,
                      "total_pages": 1,
                      "page_size": 10,
                      "page_number": 0,
                      "offset": 0,
                      "sorted": false,
                      "first": true,
                      "last": true,
                      "empty": false
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 404,
                      "error": "Not Found",
                      "code": "JOB_REQUISITION_NOT_FOUND",
                      "message": "No job requisitions were found.",
                      "path": "/api/v1/requisitions",
                      "timestamp": "2025-07-23T09:11:37.209218174Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions",
                      "timestamp": "2025-07-23T09:12:56.760253721Z"
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Create a new job requisition",
          "description": "Adds a new job requisition with the provided details",
          "operationId": "submitJobRequisition",
          "parameters": [
            {
              "name": "Authorization",
              "in": "header",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Job requisition creation payload",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/JobRequisitionSubmissionPayloadAsReq"
                },
                "example": {
                  "job_description": {
                    "title": "Software Engineer",
                    "description": "Develop and maintain Java-based backend systems.",
                    "department": "Engineering",
                    "location": "Bangalore",
                    "experience_required": 3,
                    "skills_required": "Java, Spring Boot, MySQL",
                    "qualifications_required": "B.Tech in Computer Science"
                  },
                  "positions_count": 2,
                  "target_hire_date": "2025-06-01",
                  "priority": "high",
                  "submitted_by": "anita.singh@company.com",
                  "submitted_at": "2025-05-13 12:05:36",
                  "timezone": "Asia/Kolkata"
                }
              }
            },
            "required": true
          },
          "responses": {
            "201": {
              "description": "Job requisition successfully submitted",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/JobRequisitionSubmissionResultAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "requisition_id": "379aa447-9557-42c1-856e-26f32f7da56c",
                      "submitted_by": "anita.singh@company.com",
                      "submitted_at": "2025-07-15 14:49:39",
                      "timezone": "Asia/Kolkata",
                      "message": "Job requisition successfully submitted."
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 400,
                      "error": "Bad Request",
                      "code": "VALIDATION_FAILURE",
                      "message": "Validation failed.",
                      "path": "/api/v1/requisitions",
                      "details": [
                        {
                          "field": "job_description.title",
                          "issue": "Title must not be blank."
                        },
                        {
                          "field": "positions_count",
                          "issue": "Positions count must not be null."
                        }
                      ],
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions",
                      "timestamp": "2025-07-15T09:24:45.141764613Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/requisitions/{id}": {
        "get": {
          "tags": [
            "job-requisition-controller-impl"
          ],
          "summary": "Retrieve a job requisition by ID",
          "description": "Returns a specific job requisition based on the provided ID",
          "operationId": "getJobRequisitionById",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "UUID of the job requisition",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid",
                "pattern": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              },
              "example": "dea25ba4-4d9c-4d53-bfeb-7bd821a547f3"
            }
          ],
          "responses": {
            "200": {
              "description": "Job requisition successfully retieved",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/JobRequisitionMetadataAsResp"
                  },
                  "example": {
                    "success": true,
                    "payload": {
                      "requisition_id": "dea25ba4-4d9c-4d53-bfeb-7bd721a547f3",
                      "status": "pending",
                      "job_description": {
                        "title": "Software Engineer",
                        "description": "Develop and maintain Java-based backend systems.",
                        "department": "Engineering",
                        "location": "Bangalore",
                        "experience_required": 3,
                        "skills_required": "Java, Spring Boot, MySQL",
                        "qualifications_required": "B.Tech in Computer Science"
                      },
                      "positions_count": 2,
                      "priority": "high",
                      "target_hire_date": "2025-06-01 00:00:00",
                      "submitted_by": "anita.singh@company.com",
                      "submitted_at": "2025-07-21 18:21:40",
                      "timezone": "Asia/Kolkata"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 404,
                      "error": "Not Found",
                      "code": "JOB_REQUISITION_NOT_FOUND",
                      "message": "Job requisition with ID 'dea25ba4-4d9c-4d53-bfeb-7bd821a547f3' was not found.",
                      "path": "/api/v1/requisitions/dea25ba4-4d9c-4d53-bfeb-7bd821a547f3",
                      "timestamp": "2025-07-23T07:30:55.661277606Z"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal System Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "payload": {
                      "status": 500,
                      "error": "Internal Server Error",
                      "code": "INTERNAL_SYSTEM_FAILURE",
                      "message": "<FAILURE_MESSAGE>",
                      "path": "/api/v1/requisitions/dea25ba4-4d9c-4d53-bfeb-7bd821a547f3",
                      "timestamp": "2025-07-23T07:38:33.520324497Z"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/authentication/userinfo": {
        "get": {
          "tags": [
            "authentication-controller"
          ],
          "operationId": "getUserInfo",
          "parameters": [
            {
              "name": "Access-Token",
              "in": "header",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "*/*": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/authentication/token": {
        "get": {
          "tags": [
            "authentication-controller"
          ],
          "operationId": "exchangeCode",
          "parameters": [
            {
              "name": "code",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "*/*": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/authentication/auth-url": {
        "get": {
          "tags": [
            "authentication-controller"
          ],
          "operationId": "getAuthUrl",
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "*/*": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          }
        }
      }
    }
  };

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

  // get paths
  let paths: any = Object.keys(docs.paths);
  const endpoints: any[] = [];

  paths.forEach((endpoint: string) => {
    const details = docs.paths[endpoint];
    const methods: any = Object.keys(details);

    // console.log(method)

    methods.forEach((method: any) => {
      endpoints.push({ link: endpoint, method: method.toUpperCase(), color: getColor(method.toUpperCase()), name: details[method].summary });
    })
  })

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

  useEffect(() => {
    if (localStorage) {
      // set panel collapse
      saveMenuStateToSession(localStorage.getItem("isMenuCollapse") as string);
    }
  }, []);

  useEffect(() => {
    const wrappers = document.querySelectorAll(".simplebar-content-wrapper");
    wrappers.forEach((el) => el.classList.add("simplebar-visible"));
  }, []);

  return (
    <div className={"h-full transition-[width] duration-100 ease-in-out sm:sticky sm:left-0 sm:top-0 sm:w-16 hidden sm:block " + ((isMainMenuOpen || session.isMenuCollapse) == "true" ? "lg:w-[350px]" : "lg:w-16")}>
      <nav className="bg-gray-100 dark:bg-gray-800 sm:z-[2] w-full fixed h-full sm:h-dvh translate-x-full sm:translate-x-0 sm:sticky sm:top-0 sm:left-0">
        <div className="flex h-full flex-col justify-stretch relative">
          <div className={"sticky top-0 z-10 flex shrink-0 items-center justify-between px-4 mb-4 sm:h-4 lg:h-16 border-b border-black/10 dark:border-white/10"}>
            {(isMainMenuOpen || session.isMenuCollapse) == "true" && (
              <Link href="/" className="pl-1 sm:hidden lg:flex items-start justify-center gap-2">
                <Image className="hidden dark:block h-[25px]" src="/icons/logo-light.svg" alt="" width={119} height={25} />
                <Image className="block dark:hidden h-[25px]" src="/icons/logo-dark.svg" alt="" width={119} height={25} />
                <span className="inline-flex items-center rounded-sm px-1 py-[2px] leading-tight text-xs h-[18px] font-medium inset-ring bg-blue-500/20 text-blue-500 inset-ring-blue-500/30 dark:bg-blue-light-400/20 dark:text-blue-light-400 dark:inset-ring-blue-light-400/30">v{process.env.NEXT_PUBLIC_SEAMLESS_VERSION}</span>
              </Link>
            )}
            {/* <button
              className="cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-[9px] sm:hidden lg:block"
              onClick={(e: any) => {
                e.preventDefault();
                saveMenuStateToSession((isMainMenuOpen || session.isMenuCollapse) == "true" ? "false" : "true");
              }}
            >
              {(isMainMenuOpen || session.isMenuCollapse) == "true" ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button> */}
          </div>
          <OverlayScrollbarsComponent className="px-4 flex-1" options={{ scrollbars: { autoHide: "leave", theme: (theme || session.theme) == "dark" ? "os-theme-light" : "os-theme-dark" } }}>
            <p className="mb-1 hidden h-8 items-center text-xs font-semibold text-surface-foreground-4 sm:sidebar-floating:hidden xl:flex">API List</p>
            <div className="flex flex-col gap-1">
              {endpoints.map((item: any, i) => (
                <div key={i} className="group">
                  <Link href={item.link} className={"text-xs lg:w-full sm:w-8 w-full rounded-lg flex items-center gap-2 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1 " + (pathname.startsWith(item.link) && item.link.length > 1 || item.link == pathname ? "bg-gray-200 dark:bg-gray-700" : "")}>
                    <span className={twMerge("font-semibold ms-2 w-[52] text-end flex-none", item.color)}>{item.method}</span>
                    <span className="truncate flex-1">{item.name || item.link}</span>
                  </Link>
                </div>
              ))}
            </div>
            {/* <div className="mb-[15px] mt-4 border-t border-black/10 dark:border-white/10"></div>
            <div className="space-y-1">
              {Apis.slice(0, 10).map((api: Api, i: number) => (
                <div key={i} className="group">
                  <Link href={`/services/${api.name}/overview`} className={"text-sm lg:w-full sm:w-8 w-full rounded-lg flex items-center gap-1 sm:h-8 h-10 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 py-1 " + (pathname.split("/")[1] == "services" && pathname.split("/")[2] == api.name ? "bg-gray-200 dark:bg-gray-700" : "")}>
                    <span className="flex size-8 shrink-0 items-center justify-center text-gray-700 dark:text-white">
                      <Image src={api.icon} alt="" width={16} height={16} />
                    </span>
                    <span className="flex items-center gap-2 min-w-0 max-w-full flex-1 sm:hidden sm:max-w-36 lg:inline">
                      <span className="block truncate sm:hidden lg:block">{api.title}</span>
                    </span>
                    {(isMainMenuOpen || session.isMenuCollapse) == "true" && (
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-2 rounded cursor-pointer">
                        <Star size={16} className="stroke-black/50 fill-black/50 hover:stroke-black hover:fill-black dark:stroke-white/50 dark:fill-white/50 dark:hover:fill-white transition-colors duration-300 size-3" />
                      </button>
                    )}
                  </Link>
                </div>
              ))}
            </div> */}
          </OverlayScrollbarsComponent>
          {/* <div className="sticky bottom-0 z-10 mt-auto flex flex-col gap-4 p-4">
            {(isMainMenuOpen || session.isMenuCollapse) == "true" && (
              <div className="hidden lg:block">
                <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg px-4 py-[9px]">
                  <div className="flex flex-col items-start gap-[2px] text-sm truncate">
                    <p className="text-left font-semibold text-amber-500 dark:text-amber-500">30 Days Free Trial</p>
                    <p className="text-left font-normal text-surface-foreground-0">Unlock more features</p>
                  </div>
                </button>
              </div>
            )}
            <div className={"flex items-center justify-between gap-6 flex-col " + ((isMainMenuOpen || session.isMenuCollapse) == "true" ? "lg:flex-row" : "lg:flex-col")}>
              <div className={"flex gap-2 flex-col " + ((isMainMenuOpen || session.isMenuCollapse) == "true" ? "lg:flex-row" : "lg:flex-col")}>
                <Link href="/admin/account" className={"p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit " + (pathname.startsWith("/admin") ? "bg-gray-200 dark:bg-gray-700" : "")}>
                  <Settings size={16} />
                </Link>
                <a className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" href="#">
                  <Icon name="Bell" size={16} />
                </a>
                <ThemeToggle session={session} />                
              </div>
              <button onClick={handleLogout} className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" type="button">
                <Icon name="LogOut" size={16} />
              </button>
            </div>
          </div> */}
        </div>
      </nav>
    </div>
  );
}
